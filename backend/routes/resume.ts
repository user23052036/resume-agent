import { Router } from "express";
import multer from "multer";
import { analyzeResume, analyzeResumePDF } from "../controllers/resumeController";
import { storeResume } from "../services/resumeService";
import { randomUUID } from 'crypto';

const router = Router();

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// POST /api/resume/analyze
router.post("/analyze", upload.single('file'), async (req, res) => {
  try {
    let resume_id: string;
    let extractedText: string;
    let pdfInfo: any;

    // Check if this is a PDF upload or JSON text
    let result: any;
    if (req.file) {
      // Handle PDF upload
      const { kind, resume_id: providedResumeId } = req.body;
      resume_id = providedResumeId || randomUUID();
      result = await analyzeResumePDF(req.file.buffer, kind);
      extractedText = result.extractedText;
      pdfInfo = result.pdfInfo;
    } else {
      // Handle JSON text (existing behavior)
      const { text, kind, resume_id: providedResumeId } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'text' in body" });
      }
      resume_id = providedResumeId || randomUUID();
      result = await analyzeResume({ text, kind });
      extractedText = text;
      pdfInfo = result.pdfInfo;
    }

    // Store resume data
    const record = storeResume(resume_id, extractedText, { pdfInfo });

    const response: any = {
      resume_id: record.resume_id,
      version: record.version,
      pdfInfo: record.pdfInfo,
      extractedLength: extractedText.length,
    };

    if (req.file) {
      response.summary = result.summary;
    }

    return res.json(response);
  } catch (err: any) {
    console.error("Error in /api/resume/analyze", err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

export default router;
