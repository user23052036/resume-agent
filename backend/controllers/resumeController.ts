import { GenerateParams, AnalysisResult } from "../types";
import { generateSummary } from "../services/resumeService";
import { extractTextFromPDF, validatePDFFile } from "../services/pdfService";
import fs from "fs";
import path from "path";

export async function analyzeResume(params: GenerateParams): Promise<AnalysisResult> {
  // Input validation
  if (!params.text || typeof params.text !== 'string' || params.text.trim().length === 0) {
    throw new Error("Invalid input: text must be a non-empty string");
  }

  const result = await generateSummary(params.text, params.kind);

  // Save extracted text to data file for chat functionality
  const resumeDataPath = path.join(process.cwd(), "data/raw/resume-content.json");
  const resumeData = {
    extracted_text: params.text,
    source: "text-input",
    extracted_at: new Date().toISOString(),
    metadata: {
      uploadedAt: new Date().toISOString()
    }
  };

  // Ensure directory exists
  const dir = path.dirname(resumeDataPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(resumeDataPath, JSON.stringify(resumeData, null, 2));

  const analysisResult: AnalysisResult = {
    summary: result.summary,
    inputLength: params.text.length,
    engine: result.engine,
    timestamp: new Date().toISOString(),
  };

  // Add model info if available
  if (result.model) {
    analysisResult.model = result.model;
  }

  // Add response time if available
  if (result.responseTime) {
    analysisResult.responseTime = result.responseTime;
  }

  return analysisResult;
}

export async function analyzeResumePDF(pdfBuffer: Buffer, kind?: string): Promise<AnalysisResult> {
  // Validate PDF
  if (!pdfBuffer || !(pdfBuffer instanceof Buffer) || pdfBuffer.length === 0) {
    throw new Error("Invalid PDF file. Please upload a valid PDF document.");
  }

  if (!validatePDFFile(pdfBuffer)) {
    throw new Error("Invalid PDF file. Please upload a valid PDF document.");
  }

  // Extract text from PDF
  const pdfResult = await extractTextFromPDF(pdfBuffer);

  // Save extracted text to data file for chat functionality
  const resumeDataPath = path.join(process.cwd(), "data/raw/resume-content.json");
  const resumeData = {
    extracted_text: pdfResult.text,
    source: "pdf-upload",
    extracted_at: pdfResult.extractedAt,
    metadata: {
      pageCount: pdfResult.pageCount,
      uploadedAt: new Date().toISOString()
    }
  };

  // Ensure directory exists
  const dir = path.dirname(resumeDataPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(resumeDataPath, JSON.stringify(resumeData, null, 2));

  // Generate summary using existing LLM service
  const result = await generateSummary(pdfResult.text, kind);

  const analysisResult: AnalysisResult = {
    summary: result.summary,
    inputLength: pdfResult.text.length,
    engine: result.engine,
    timestamp: new Date().toISOString(),
    pdfInfo: {
      pageCount: pdfResult.pageCount,
      extractedAt: pdfResult.extractedAt,
    }
  };

  // Add model info if available
  if (result.model) {
    analysisResult.model = result.model;
  }

  // Add response time if available
  if (result.responseTime) {
    analysisResult.responseTime = result.responseTime;
  }

  return analysisResult;
}
