
import fs from "fs-extra";
import multer from "multer";

const UPLOAD_DIR = "uploads/legal-docs";

// ✅ FIX: Ensure the upload directory exists at startup (fs-extra's ensureDirSync)
fs.ensureDirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // ✅ FIX: `destination` must be a function when using diskStorage callbacks;
    //         using a plain string works too, but a function is safer when the
    //         directory needs to be created conditionally per-request in future.
    cb(null, UPLOAD_DIR);
  },

  filename: (_req, file, cb) => {
    // ✅ FIX: Parameter was named `cd` but called as `cb` — renamed consistently.
    // ✅ OPT: Sanitize the original filename to strip spaces / special chars that
    //         could cause issues on certain file systems.
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${sanitized}`);
  },
});

const FILE_SIZE_LIMIT_MB = 20;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

// ✅ OPT: Added fileFilter + size limit — prevents uploading arbitrary files.
export const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type: ${file.mimetype}. Allowed: PDF, Word, plain text.`
        )
      );
    }
  },
});