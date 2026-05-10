import { Router } from "express";
import { upload } from "../../config/storage.config";
import { DocumentController } from "./document.controller";

const router = Router();

router.post("/upload/:id",  upload.single("document"), DocumentController.processDocument);
router.post("/ask/:id",  DocumentController.queryLegalDocuments);
router.delete("/:docId",  DocumentController.deleteDocument);

export const DocumentRouters = router;