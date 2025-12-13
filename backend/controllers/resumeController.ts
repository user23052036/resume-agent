import { GenerateParams, AnalysisResult } from "../types";
import { generateSummary } from "../services/resumeService";
import { extractTextFromPDF, validatePDFFile } from "../services/pdfService";

export async function analyzeResume(params: GenerateParams): Promise<AnalysisResult> {
  // Input validation
  if (!params.text || typeof params.text !== 'string' || params.text.trim().length === 0) {
    throw new Error("Invalid input: text must be a non-empty string");
  }

  const result = await generateSummary(params.text, params.kind);

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
