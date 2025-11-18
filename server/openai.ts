import OpenAI from "openai";

// Reference: javascript_openai blueprint
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface PicoExtractionResult {
  population: string | null;
  intervention: string | null;
  comparison: string | null;
  outcome: string | null;
  populationConfidence: number;
  interventionConfidence: number;
  comparisonConfidence: number;
  outcomeConfidence: number;
}

export interface EntityExtractionResult {
  diseases: string[];
  drugs: string[];
  proteins: string[];
  genes: string[];
}

export async function extractPicoElements(text: string): Promise<PicoExtractionResult> {
  const prompt = `Analyze the following biomedical research text and extract PICO elements.

PICO stands for:
- Population: The patient group or subjects being studied
- Intervention: The treatment or exposure being investigated
- Comparison: The alternative treatment or control group
- Outcome: The measured results or endpoints

Text:
${text}

Provide the extracted PICO elements and confidence scores (0.0 to 1.0) in JSON format:
{
  "population": "extracted text or null",
  "intervention": "extracted text or null",
  "comparison": "extracted text or null",
  "outcome": "extracted text or null",
  "populationConfidence": 0.0-1.0,
  "interventionConfidence": 0.0-1.0,
  "comparisonConfidence": 0.0-1.0,
  "outcomeConfidence": 0.0-1.0
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a biomedical research expert specializing in extracting PICO elements from research papers.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return {
    population: result.population || null,
    intervention: result.intervention || null,
    comparison: result.comparison || null,
    outcome: result.outcome || null,
    populationConfidence: result.populationConfidence || 0,
    interventionConfidence: result.interventionConfidence || 0,
    comparisonConfidence: result.comparisonConfidence || 0,
    outcomeConfidence: result.outcomeConfidence || 0,
  };
}

export async function extractEntities(text: string): Promise<EntityExtractionResult> {
  const prompt = `Extract biomedical entities from the following research text.

Identify and list:
- Diseases/Conditions
- Drugs/Medications
- Proteins
- Genes

Text:
${text.substring(0, 3000)}

Provide the entities in JSON format:
{
  "diseases": ["entity1", "entity2"],
  "drugs": ["entity1", "entity2"],
  "proteins": ["entity1", "entity2"],
  "genes": ["entity1", "entity2"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a biomedical NLP expert specializing in named entity recognition for medical research.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return {
    diseases: result.diseases || [],
    drugs: result.drugs || [],
    proteins: result.proteins || [],
    genes: result.genes || [],
  };
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.substring(0, 8000),
  });

  return response.data[0].embedding;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function chunkText(text: string, maxChunkSize: number = 500): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function answerQuestion(
  question: string,
  context: Array<{ text: string; paperTitle: string; paperId: string }>
): Promise<{ answer: string; citations: Array<{ paperId: string; paperTitle: string; excerpt: string }> }> {
  const contextText = context
    .map((c, i) => `[${i + 1}] From "${c.paperTitle}":\n${c.text}`)
    .join("\n\n");

  const prompt = `Based on the following research paper excerpts, answer the question. Cite sources using [1], [2], etc.

Research excerpts:
${contextText}

Question: ${question}

Provide a comprehensive answer with proper citations in JSON format:
{
  "answer": "Your answer with citations like [1], [2]",
  "citedIndices": [1, 2]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a biomedical research assistant. Answer questions based on provided research excerpts and always cite your sources.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  const citedIndices = result.citedIndices || [];

  const citations = citedIndices.map((idx: number) => {
    const ctx = context[idx - 1];
    return {
      paperId: ctx.paperId,
      paperTitle: ctx.paperTitle,
      excerpt: ctx.text.substring(0, 200) + "...",
    };
  });

  return {
    answer: result.answer || "I couldn't generate an answer based on the provided context.",
    citations,
  };
}
