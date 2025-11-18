import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Papers table
export const papers = pgTable("papers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  abstract: text("abstract").notNull(),
  fullText: text("full_text").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
});

export const insertPaperSchema = createInsertSchema(papers).omit({
  id: true,
  uploadedAt: true,
  status: true,
});

export type InsertPaper = z.infer<typeof insertPaperSchema>;
export type Paper = typeof papers.$inferSelect;

// PICO Elements
export const picoElements = pgTable("pico_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paperId: varchar("paper_id").notNull(),
  population: text("population"),
  intervention: text("intervention"),
  comparison: text("comparison"),
  outcome: text("outcome"),
  populationConfidence: real("population_confidence"),
  interventionConfidence: real("intervention_confidence"),
  comparisonConfidence: real("comparison_confidence"),
  outcomeConfidence: real("outcome_confidence"),
  extractedAt: timestamp("extracted_at").defaultNow().notNull(),
});

export const insertPicoElementSchema = createInsertSchema(picoElements).omit({
  id: true,
  extractedAt: true,
});

export type InsertPicoElement = z.infer<typeof insertPicoElementSchema>;
export type PicoElement = typeof picoElements.$inferSelect;

// Entities
export const entities = pgTable("entities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paperId: varchar("paper_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  text: text("text").notNull(),
  frequency: integer("frequency").notNull().default(1),
  context: text("context"),
});

export const insertEntitySchema = createInsertSchema(entities).omit({
  id: true,
});

export type InsertEntity = z.infer<typeof insertEntitySchema>;
export type Entity = typeof entities.$inferSelect;

// Text Chunks (for semantic search)
export const textChunks = pgTable("text_chunks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paperId: varchar("paper_id").notNull(),
  chunkText: text("chunk_text").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  embedding: real("embedding").array().notNull(),
});

export const insertTextChunkSchema = createInsertSchema(textChunks).omit({
  id: true,
});

export type InsertTextChunk = z.infer<typeof insertTextChunkSchema>;
export type TextChunk = typeof textChunks.$inferSelect;

// Q&A Conversations
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  citations: jsonb("citations").notNull().$type<Array<{ paperId: string; paperTitle: string; excerpt: string }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Legacy users table (keeping for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
