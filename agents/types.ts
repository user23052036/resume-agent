export interface ResumeData {
  text: string;
  source: 'pdf' | 'text';
  metadata?: {
    filename?: string;
    pages?: number;
    extracted_at?: string;
  };
}

export interface AgentConfig {
  backendUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface RoleSummary {
  role: string;
  summary: string;
  generated_at: string;
  confidence?: number;
}

export interface AgentResult {
  summaries: RoleSummary[];
  raw_data: ResumeData;
  processed_at: string;
}

export interface ResumeAgent {
  processResume(data: ResumeData): Promise<AgentResult>;
  generateRoleSummary(text: string, role: string): Promise<string>;
}
