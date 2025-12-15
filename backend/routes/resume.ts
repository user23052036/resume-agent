import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import {
  analyzeResume,
  analyzeResumePDF,
} from "../controllers/resumeController";

const router = Router();

/**
 * Multer config:
 * - In-memory only (Vercel-safe)
 * - PDF only
 * - Max 10MB
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

/**
 * POST /api/resume/analyze
 *
 * Accepts:
 * - multipart/form-data (PDF upload)
 * - OR JSON text input (optional / legacy)
 *
 * Returns:
 * - resume_id
 * - summary
 * - extracted_text (NORMALIZED, chat-ready)
 */
router.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    const resume_id = req.body.resume_id || randomUUID();

    // -----------------------------
    // PDF UPLOAD PATH
    // -----------------------------
    if (req.file) {
      const result = await analyzeResumePDF(req.file.buffer, req.body.kind);

      return res.json({
        resume_id,
        summary: result.summary,
        extracted_text: result.extractedText, // ✅ normalized
        extractedLength: result.extractedText.length,
        pdfInfo: result.pdfInfo,
      });
    }

    // -----------------------------
    // TEXT INPUT PATH (fallback)
    // -----------------------------
    const { text, kind } = req.body;

    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid resume text" });
    }

    const result = await analyzeResume({ text, kind });

    return res.json({
      resume_id,
      summary: result.summary,
      extracted_text: result.extractedText, // ✅ normalized
      extractedLength: result.extractedText.length,
    });
  } catch (err: any) {
    console.error("Error in /api/resume/analyze:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze resume",
    });
  }
});

export default router;
