export interface GenerateParams
{
  text: string;
  kind?: string;
}

export interface PDFInfo
{
  pageCount: number;
  extractedAt: string;
}

export interface AnalysisResult
{
  summary: string;
  inputLength: number;
  engine: string;
  timestamp: string;
  pdfInfo?: PDFInfo;
  model?: string;
  responseTime?: number;
}
