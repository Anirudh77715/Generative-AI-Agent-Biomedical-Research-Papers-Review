import {
  type User,
  type InsertUser,
  type Paper,
  type InsertPaper,
  type PicoElement,
  type InsertPicoElement,
  type Entity,
  type InsertEntity,
  type TextChunk,
  type InsertTextChunk,
  type Conversation,
  type InsertConversation,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllPapers(): Promise<Paper[]>;
  getPaper(id: string): Promise<Paper | undefined>;
  createPaper(paper: InsertPaper): Promise<Paper>;
  updatePaperStatus(id: string, status: string): Promise<void>;
  deletePaper(id: string): Promise<void>;

  getAllPicoElements(): Promise<PicoElement[]>;
  getPicoByPaperId(paperId: string): Promise<PicoElement | undefined>;
  createPicoElement(pico: InsertPicoElement): Promise<PicoElement>;

  getAllEntities(): Promise<Entity[]>;
  getEntitiesByPaperId(paperId: string): Promise<Entity[]>;
  createEntity(entity: InsertEntity): Promise<Entity>;

  getAllTextChunks(): Promise<TextChunk[]>;
  getTextChunksByPaperId(paperId: string): Promise<TextChunk[]>;
  createTextChunk(chunk: InsertTextChunk): Promise<TextChunk>;

  getAllConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private papers: Map<string, Paper>;
  private picoElements: Map<string, PicoElement>;
  private entities: Map<string, Entity>;
  private textChunks: Map<string, TextChunk>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.users = new Map();
    this.papers = new Map();
    this.picoElements = new Map();
    this.entities = new Map();
    this.textChunks = new Map();
    this.conversations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPapers(): Promise<Paper[]> {
    return Array.from(this.papers.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getPaper(id: string): Promise<Paper | undefined> {
    return this.papers.get(id);
  }

  async createPaper(insertPaper: InsertPaper): Promise<Paper> {
    const id = randomUUID();
    const paper: Paper = {
      ...insertPaper,
      id,
      uploadedAt: new Date(),
      status: "processed",
    };
    this.papers.set(id, paper);
    return paper;
  }

  async updatePaperStatus(id: string, status: string): Promise<void> {
    const paper = this.papers.get(id);
    if (paper) {
      paper.status = status;
      this.papers.set(id, paper);
    }
  }

  async deletePaper(id: string): Promise<void> {
    this.papers.delete(id);
    Array.from(this.picoElements.values())
      .filter((p) => p.paperId === id)
      .forEach((p) => this.picoElements.delete(p.id));
    Array.from(this.entities.values())
      .filter((e) => e.paperId === id)
      .forEach((e) => this.entities.delete(e.id));
    Array.from(this.textChunks.values())
      .filter((t) => t.paperId === id)
      .forEach((t) => this.textChunks.delete(t.id));
  }

  async getAllPicoElements(): Promise<PicoElement[]> {
    return Array.from(this.picoElements.values());
  }

  async getPicoByPaperId(paperId: string): Promise<PicoElement | undefined> {
    return Array.from(this.picoElements.values()).find((p) => p.paperId === paperId);
  }

  async createPicoElement(insertPico: InsertPicoElement): Promise<PicoElement> {
    const id = randomUUID();
    const pico: PicoElement = {
      ...insertPico,
      id,
      extractedAt: new Date(),
    };
    this.picoElements.set(id, pico);
    return pico;
  }

  async getAllEntities(): Promise<Entity[]> {
    return Array.from(this.entities.values());
  }

  async getEntitiesByPaperId(paperId: string): Promise<Entity[]> {
    return Array.from(this.entities.values()).filter((e) => e.paperId === paperId);
  }

  async createEntity(insertEntity: InsertEntity): Promise<Entity> {
    const id = randomUUID();
    const entity: Entity = {
      ...insertEntity,
      id,
    };
    this.entities.set(id, entity);
    return entity;
  }

  async getAllTextChunks(): Promise<TextChunk[]> {
    return Array.from(this.textChunks.values());
  }

  async getTextChunksByPaperId(paperId: string): Promise<TextChunk[]> {
    return Array.from(this.textChunks.values()).filter((t) => t.paperId === paperId);
  }

  async createTextChunk(insertChunk: InsertTextChunk): Promise<TextChunk> {
    const id = randomUUID();
    const chunk: TextChunk = {
      ...insertChunk,
      id,
    };
    this.textChunks.set(id, chunk);
    return chunk;
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createConversation(insertConv: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConv,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
}

export const storage = new MemStorage();
