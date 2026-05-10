import mongoose from "mongoose";
import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { envVars } from "./env";

export const docEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: envVars.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});

export const queryEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: envVars.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_QUERY,
});

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: envVars.GOOGLE_API_KEY,
  temperature: 0.3,
  maxOutputTokens: 2048,
});

let vectorStore: MongoDBAtlasVectorSearch | null = null;

export const getVectorStore = async (): Promise<MongoDBAtlasVectorSearch> => {
  if (vectorStore) return vectorStore;

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error(
      "Mongoose is not connected. Call mongoose.connect() before getVectorStore()."
    );
  }

  // ✅ FIX: Do NOT import Collection from "mongodb" directly — that pulls in
  //    your app's mongodb@7 types which conflict with @langchain/mongodb's
  //    bundled mongodb@6 types. Instead, cast through `unknown` so TS accepts
  //    the structurally identical (but differently-versioned) Collection type.
  //    At runtime there is only one Collection object — no actual conflict exists.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collection = db.collection("document_chunks") as any;

  vectorStore = new MongoDBAtlasVectorSearch(docEmbeddings, {
    collection,
    indexName: "vector_index",
    textKey: "pageContent",
    embeddingKey: "embedding",
  });

  return vectorStore;
};

export const resetVectorStore = (): void => {
  vectorStore = null;
};

export const initVectorStore = getVectorStore;