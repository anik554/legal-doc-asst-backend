import mongoose, { Schema } from "mongoose";
import { ILegalDocument } from "./document.interfaces";

const DocumentSchema = new Schema<ILegalDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    filename: { type: String, required: true },
    originalName: { type: String },
    mimeType: { type: String },
    filePath: { type: String },
    uploadDate: { type: Date, default: Date.now },
    metadata: {
      title: { type: String },
      caseNumber: { type: String },
      jurisdiction: { type: String },
    },
    chunksCount: { type: Number },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey:false
  }
);

export const LegalDocument = mongoose.model("LegalDocument", DocumentSchema);