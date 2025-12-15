const pdfParse = require('pdf-parse');


export interface PDFExtractResult {
  text: string;
  pageCount: number;
  extractedAt: string;
}

/**
 * Extract text content from a PDF buffer
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<PDFExtractResult> {
  try {
    const data = await pdfParse(pdfBuffer);

    return {
      text: data.text.trim(),
      pageCount: data.numpages,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
  }
}

/**
 * Validate PDF file based on buffer content
 */
export function validatePDFFile(buffer: Buffer): boolean {
  // Check for PDF magic number (%PDF-)
  if (buffer.length < 4) return false;

  const header = buffer.slice(0, 4).toString();
  return header === '%PDF';
}
