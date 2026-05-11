import mongoose from "mongoose";

export interface DocumentMetadata {
  title?: string;
  caseNumber?: string;
  jurisdiction?: string;
  [key: string]: unknown;
}

export interface ILegalDocument extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName?: string;
  mimeType?: string;
  filePath?: string;
  uploadDate: Date;
  metadata: {
    title?: string;
    caseNumber?: string;
    jurisdiction?: string;
    [key: string]: unknown;
  };
  chunksCount?: number;
  status: "pending" | "processed" | "failed";
}