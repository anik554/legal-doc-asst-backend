/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import AppError from "../../errorHelpers/AppError";
import HttpStatus from "http-status";
import { DocumentServices } from "./document.service";
import { sendResponse } from "../../utils/sendResponse";
import { DocumentMetadata } from "./document.interfaces";

const processDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new AppError("No file attached to the request.", HttpStatus.NOT_FOUND);
    }

    const userId = req.params.id;
    const metadata: DocumentMetadata = {
      title: req.body.title,
      caseNumber: req.body.caseNumber,
      jurisdiction: req.body.jurisdiction,
    };

    const doc = await DocumentServices.processDocument(
      userId as string,
      req.file,
      metadata,
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Document processed and indexed successfully.",
      data: doc,
    });
  },
);

const queryLegalDocuments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const { question, k } = req.body as { question?: string; k?: number };

     if (!question?.trim()) {
      throw new AppError("A non-empty question is required.", HttpStatus.BAD_REQUEST);
    }

    const topK = Math.min(Number(k) || 6, 20);

    const result = await DocumentServices.queryLegalDocuments(userId as string, question.trim(), topK);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Query answered successfully.",
      data: result,
    });
  },
);

const deleteDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { docId } = req.params;
 
    if (!docId) {
      throw new AppError("Document ID is required.", HttpStatus.BAD_REQUEST);
    }
 
    await DocumentServices.deleteDocument(docId as string, userId);
 
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Document deleted successfully.",
      data: null,
    });
  }
);

export const DocumentController = {
  processDocument,
  queryLegalDocuments,
  deleteDocument
};
