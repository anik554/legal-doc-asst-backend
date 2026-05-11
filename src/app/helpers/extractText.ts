import fs from "fs-extra";
import mammoth from "mammoth";
// ✅ pdf-parse v2+ exports a CLASS, not a callable function.
// The correct named export is `PDFParse` — there is no default function.
import { PDFParse } from "pdf-parse";

/**
 * Extract raw text from an uploaded file based on its MIME type.
 * Supports: PDF, Word (.doc / .docx), plain text (.txt)
 */
export const extractText = async (
  filePath: string,
  mimetype: string
): Promise<string> => {

  // ─── PDF ────────────────────────────────────────────────────────────────────
  if (mimetype === "application/pdf") {
    const buffer = await fs.readFile(filePath);

    // PDFParse is a class: instantiate with { data: buffer }, then load → getText
    const parser = new PDFParse({ data: buffer });
    const doc    = await parser.load(buffer);
    const result = await parser.getText(doc);   // { pages, text, total }

    return result.text ?? "";
  }

  // ─── Word ───────────────────────────────────────────────────────────────────
  if (
    mimetype === "application/msword" ||
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  // ─── Plain text ─────────────────────────────────────────────────────────────
  if (mimetype === "text/plain") {
    return fs.readFile(filePath, "utf8");
  }

  throw new Error(
    `Unsupported file type: ${mimetype}. Allowed: PDF, DOC/DOCX, TXT.`
  );
};