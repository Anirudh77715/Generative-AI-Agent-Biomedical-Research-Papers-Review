import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPaperSchema, insertPicoElementSchema, insertEntitySchema, insertTextChunkSchema, insertConversationSchema } from "@shared/schema";
import {
  extractPicoElements,
  extractEntities,
  generateEmbedding,
  chunkText,
  cosineSimilarity,
  answerQuestion,
} from "./openai";
import { extractTextFromPDF } from "./pdf-parser";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Papers endpoints
  app.get("/api/papers", async (_req, res) => {
    try {
      const papers = await storage.getAllPapers();
      res.json(papers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch papers" });
    }
  });

  app.get("/api/papers/:id", async (req, res) => {
    try {
      const paper = await storage.getPaper(req.params.id);
      if (!paper) {
        return res.status(404).json({ error: "Paper not found" });
      }
      res.json(paper);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch paper" });
    }
  });

  app.post("/api/papers", async (req, res) => {
    try {
      const validatedData = insertPaperSchema.parse(req.body);
      const paper = await storage.createPaper(validatedData);

      // Generate embeddings for semantic search
      const chunks = chunkText(validatedData.fullText);
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);
        await storage.createTextChunk({
          paperId: paper.id,
          chunkText: chunks[i],
          chunkIndex: i,
          embedding,
        });
      }

      res.json(paper);
    } catch (error) {
      console.error("Error creating paper:", error);
      res.status(400).json({ error: "Invalid paper data" });
    }
  });

  // PDF upload endpoint
  app.post("/api/papers/upload-pdf", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file provided" });
      }

      const pdfText = await extractTextFromPDF(req.file.buffer);
      
      // Extract basic info from request
      const { title, authors, abstract } = req.body;
      
      if (!title || !authors || !abstract) {
        return res.status(400).json({ error: "Title, authors, and abstract are required" });
      }

      const validatedData = insertPaperSchema.parse({
        title,
        authors,
        abstract,
        fullText: pdfText,
      });

      const paper = await storage.createPaper(validatedData);

      // Generate embeddings for semantic search
      const chunks = chunkText(pdfText);
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);
        await storage.createTextChunk({
          paperId: paper.id,
          chunkText: chunks[i],
          chunkIndex: i,
          embedding,
        });
      }

      res.json(paper);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      res.status(500).json({ error: "Failed to process PDF" });
    }
  });

  app.delete("/api/papers/:id", async (req, res) => {
    try {
      await storage.deletePaper(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete paper" });
    }
  });

  // PICO extraction endpoint
  app.post("/api/papers/:id/extract-pico", async (req, res) => {
    try {
      const paper = await storage.getPaper(req.params.id);
      if (!paper) {
        return res.status(404).json({ error: "Paper not found" });
      }

      const existingPico = await storage.getPicoByPaperId(paper.id);
      if (existingPico) {
        return res.json(existingPico);
      }

      const picoResult = await extractPicoElements(paper.abstract + "\n\n" + paper.fullText.substring(0, 2000));

      const pico = await storage.createPicoElement({
        paperId: paper.id,
        population: picoResult.population,
        intervention: picoResult.intervention,
        comparison: picoResult.comparison,
        outcome: picoResult.outcome,
        populationConfidence: picoResult.populationConfidence,
        interventionConfidence: picoResult.interventionConfidence,
        comparisonConfidence: picoResult.comparisonConfidence,
        outcomeConfidence: picoResult.outcomeConfidence,
      });

      res.json(pico);
    } catch (error) {
      console.error("Error extracting PICO:", error);
      res.status(500).json({ error: "Failed to extract PICO elements" });
    }
  });

  // Entity extraction endpoint
  app.post("/api/papers/:id/extract-entities", async (req, res) => {
    try {
      const paper = await storage.getPaper(req.params.id);
      if (!paper) {
        return res.status(404).json({ error: "Paper not found" });
      }

      const existingEntities = await storage.getEntitiesByPaperId(paper.id);
      if (existingEntities.length > 0) {
        return res.json(existingEntities);
      }

      const entityResult = await extractEntities(paper.abstract + "\n\n" + paper.fullText);

      const entities = [];
      for (const [type, items] of Object.entries(entityResult)) {
        for (const text of items as string[]) {
          const entity = await storage.createEntity({
            paperId: paper.id,
            type: type.slice(0, -1),
            text,
            frequency: 1,
            context: null,
          });
          entities.push(entity);
        }
      }

      res.json(entities);
    } catch (error) {
      console.error("Error extracting entities:", error);
      res.status(500).json({ error: "Failed to extract entities" });
    }
  });

  // PICO elements endpoint
  app.get("/api/pico-elements", async (_req, res) => {
    try {
      const picoElements = await storage.getAllPicoElements();
      res.json(picoElements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch PICO elements" });
    }
  });

  // Entities endpoint
  app.get("/api/entities", async (_req, res) => {
    try {
      const entities = await storage.getAllEntities();
      res.json(entities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch entities" });
    }
  });

  // Semantic search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.query as string;
      if (!query) {
        return res.json([]);
      }

      const queryEmbedding = await generateEmbedding(query);
      const allChunks = await storage.getAllTextChunks();
      const papers = await storage.getAllPapers();

      const results = allChunks
        .map((chunk) => {
          const paper = papers.find((p) => p.id === chunk.paperId);
          if (!paper) return null;

          const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
          return {
            paperId: chunk.paperId,
            paperTitle: paper.title,
            authors: paper.authors,
            excerpt: chunk.chunkText,
            relevanceScore: similarity,
          };
        })
        .filter((r) => r !== null && r.relevanceScore > 0.7)
        .sort((a, b) => b!.relevanceScore - a!.relevanceScore)
        .slice(0, 10);

      res.json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Q&A endpoint
  app.post("/api/qa", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const queryEmbedding = await generateEmbedding(question);
      const allChunks = await storage.getAllTextChunks();
      const papers = await storage.getAllPapers();

      const relevantChunks = allChunks
        .map((chunk) => {
          const paper = papers.find((p) => p.id === chunk.paperId);
          if (!paper) return null;

          const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
          return {
            similarity,
            text: chunk.chunkText,
            paperTitle: paper.title,
            paperId: paper.id,
          };
        })
        .filter((r) => r !== null && r.similarity > 0.6)
        .sort((a, b) => b!.similarity - a!.similarity)
        .slice(0, 5);

      if (relevantChunks.length === 0) {
        return res.json({
          answer: "I couldn't find relevant information in your uploaded papers to answer this question.",
          citations: [],
        });
      }

      const qaResult = await answerQuestion(
        question,
        relevantChunks.map((c) => ({
          text: c!.text,
          paperTitle: c!.paperTitle,
          paperId: c!.paperId,
        }))
      );

      const conversation = await storage.createConversation({
        question,
        answer: qaResult.answer,
        citations: qaResult.citations,
      });

      res.json(conversation);
    } catch (error) {
      console.error("Error answering question:", error);
      res.status(500).json({ error: "Failed to answer question" });
    }
  });

  // Conversations endpoint
  app.get("/api/conversations", async (_req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
