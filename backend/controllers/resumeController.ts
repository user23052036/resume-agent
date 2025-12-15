import { GenerateParams, AnalysisResult } from "../types";
import { generateSummary } from "../services/resumeService";
import { extractTextFromPDF, validatePDFFile } from "../services/pdfService";
import fs from "fs";
import path from "path";

/**
 * FIX: Normalize extracted resume text so:
 * - words are not glued
 * - sections like Skills / Experience are detectable
 * - downstream chat works reliably
 */
function normalizeResumeText(raw: string): string {
  return raw
    // Fix glued words: AaravMehta → Aarav Mehta, KIITUniversity → KIIT University
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")

    // Fix commas without space
    .replace(/,([A-Za-z])/g, ", $1")

    // Fix pipes
    .replace(/\|/g, " | ")

    // Fix bullets
    .replace(/-\s*/g, "- ")

    // Normalize whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}


export async function analyzeResume(
  params: GenerateParams
): Promise<AnalysisResult> {
  if (!params.text || typeof params.text !== "string") {
    throw new Error("Invalid input: text must be a non-empty string");
  }

  // FIX: normalize text ONCE
  const normalizedText = normalizeResumeText(params.text);

  const result = await generateSummary(normalizedText, params.kind);

  const analysisResult: AnalysisResult = {
    summary: result.summary,
    inputLength: normalizedText.length,
    engine: result.engine,
    timestamp: new Date().toISOString(),
    extractedText: normalizedText, // FIX: normalized
  };

  if (result.model) analysisResult.model = result.model;
  if (result.responseTime) analysisResult.responseTime = result.responseTime;

  return analysisResult;
}


export async function analyzeResumePDF(pdfBuffer: Buffer, kind?: string): Promise<AnalysisResult> 
{
  // Validate PDF
  if (!pdfBuffer || !validatePDFFile(pdfBuffer) || pdfBuffer.length === 0) {
    throw new Error("Invalid PDF file. Please upload a valid PDF document.");
  }

  if (!validatePDFFile(pdfBuffer)) {
    throw new Error("Invalid PDF file. Please upload a valid PDF document.");
  }

  // Extract text from PDF
  const pdfResult = await extractTextFromPDF(pdfBuffer);
  const normalizedText = normalizeResumeText(pdfResult.text);

  
  if (!normalizedText || normalizedText.length < 50) {
  throw new Error("PDF extraction failed or resume is empty.");
  }
  

  // Generate summary using existing LLM service
  const result = await generateSummary(normalizedText, kind);

  const analysisResult: AnalysisResult = 
  {
    summary: result.summary,
    inputLength: normalizedText.length,
    engine: result.engine,
    timestamp: new Date().toISOString(),
    pdfInfo: 
    {
      pageCount: pdfResult.pageCount,
      extractedAt: pdfResult.extractedAt,
    },
    extractedText: normalizedText, // FIX
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
