import fs from "fs-extra";
import mammoth from "mammoth";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfModule = require("pdf-parse");
const pdfParse = pdfModule.default ?? pdfModule;

console.log("pdf-parse exports:", Object.keys(pdfModule));
console.log("typeof default:", typeof pdfModule.default);
console.log("typeof module:", typeof pdfModule);

export const extractText = async (
  filePath: string,
  mimetype: string
): Promise<string> => {

  if (mimetype === "application/pdf") {
    const buffer = await fs.readFile(filePath);
    const result = await pdfParse(buffer);
    return result.text ?? "";
  }

  if (
    mimetype === "application/msword" ||
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (mimetype === "text/plain") {
    return fs.readFile(filePath, "utf8");
  }

  throw new Error(
    `Unsupported file type: ${mimetype}. Allowed: PDF, DOC/DOCX, TXT.`
  );
};