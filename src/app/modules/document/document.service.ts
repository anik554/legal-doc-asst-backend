import fs from "fs-extra";
import mongoose from "mongoose";
import { Document } from "@langchain/core/documents";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { LegalDocument } from "./document.model";
import { getVectorStore, queryEmbeddings, llm } from "../../config/langchain.config";
import { extractText } from "../../helpers/extractText";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DocumentMetadata {
  title?: string;
  caseNumber?: string;
  jurisdiction?: string;
  [key: string]: unknown;
}

// ─── processDocument ──────────────────────────────────────────────────────────

const processDocument = async (
  userId: string,
  file: Express.Multer.File,
  metadata: DocumentMetadata
) => {
  const { path: filePath, filename, originalname, mimetype } = file;

  const doc = await LegalDocument.create({
    userId,
    filename,
    originalName: originalname,
    mimeType: mimetype,
    filePath,
    metadata,
    status: "pending",
  });

  try {
    const text = await extractText(filePath, mimetype);

    if (!text.trim()) {
      throw new Error("Extracted text is empty — document may be image-only.");
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(text);

    const langchainDocs = chunks.map(
      (chunk, i) =>
        new Document({
          pageContent: chunk,
          metadata: {
            documentId: doc._id.toString(),
            userId,
            chunkIndex: i,
          },
        })
    );

    const vectorStore = await getVectorStore();
    await vectorStore.addDocuments(langchainDocs);

    await LegalDocument.findByIdAndUpdate(doc._id, {
      chunksCount: chunks.length,
      status: "processed",
    });

    await fs.remove(filePath);
    return doc;
  } catch (err) {
    await LegalDocument.findByIdAndUpdate(doc._id, { status: "failed" });
    throw err;
  }
};

// ─── queryLegalDocuments ──────────────────────────────────────────────────────

const queryLegalDocuments = async (
  userId: string,
  question: string,
  k = 6
) => {
  const vectorStore = await getVectorStore();

  // ✅ Embed the question with RETRIEVAL_QUERY task type
  const questionEmbedding = await queryEmbeddings.embedQuery(question);

  // ✅ FIX: MongoDBAtlasVectorSearch filter shape — preFilter uses MQL syntax
  //         The filter object is passed as-is to the Atlas $vectorSearch stage.
  //         Plain MQL works here (no special wrapper needed unlike the retriever).
  const results = await vectorStore.similaritySearchVectorWithScore(
    questionEmbedding,
    k,
    {
      preFilter: {
        userId: { $eq: userId },
      },
    }
  );

  if (results.length === 0) {
    return {
      answer:
        "I couldn't find any relevant information in your uploaded documents.",
      sources: [],
    };
  }

  const relevantDocs = results.map(([doc]) => doc);

  const context = relevantDocs
    .map((doc, i) => `[Source ${i + 1}]\n${doc.pageContent}`)
    .join("\n\n---\n\n");

  const messages = [
    new SystemMessage(
      `You are a highly accurate Legal AI Assistant.
Answer ONLY based on the provided context.
If the answer is not in the context, respond with:
"I don't have sufficient information from the uploaded documents."
Cite source numbers (e.g. [Source 1]) when referencing specific passages.
Be concise, professional, and complete.`
    ),
    new HumanMessage(`Context:\n${context}\n\nQuestion: ${question}`),
  ];

  const response = await llm.invoke(messages);

  return {
    answer: response.content,
    sources: relevantDocs.map((d) => d.metadata),
  };
};

// ─── deleteDocument ───────────────────────────────────────────────────────────

const deleteDocument = async (docId: string, userId: string): Promise<void> => {
  const doc = await LegalDocument.findOneAndDelete({ _id: docId, userId });
  if (!doc) return;

  const db = mongoose.connection.db;
  if (db) {
    await db
      .collection("document_chunks")
      .deleteMany({ "metadata.documentId": docId });
  }

  if (doc.filePath) {
    await fs.remove(doc.filePath).catch(() => { /* non-fatal */ });
  }
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const DocumentServices = {
  processDocument,
  queryLegalDocuments,
  deleteDocument,
};