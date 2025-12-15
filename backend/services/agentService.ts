import fs from "fs";
import path from "path";
import { callOpenRouterLLM } from "../adapters/openrouterAdapter";

interface ResumeRecord {
  resume_id: string;
  version: number;
  extracted_text: string;
  pdfInfo?: any;
  extractedAt: string;
}

export class AgentService {
  static isReady(): boolean {
    return true;
  }

  static getAvailableRoles(): string[] {
    return [
      "backend-engineer",
      "frontend-engineer",
      "full-stack-developer",
      "devops-engineer",
    ];
  }

  static async chat(message: string, resumeRecord: ResumeRecord): Promise<string> {
    const resumeText = resumeRecord.extracted_text;

    // Validate resume text
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 10) {
      console.error("Invalid resume text:", resumeText);
      throw new Error("Resume content appears to be empty or invalid. Please re-upload your resume PDF.");
    }

    console.log(`Processing chat request with resume text length: ${resumeText.length}`);

    const systemPrompt = `You are a resume Q&A assistant. Use ONLY the resume content provided in \`resume_id: ${resumeRecord.resume_id}\`. If the answer cannot be found in that resume, respond exactly: 'Not found in this resume ${resumeRecord.resume_id}.' Do not guess or include content from any other resume.`;

    const userPrompt = `QUESTION: ${message}

Context: ${JSON.stringify({
      resume_id: resumeRecord.resume_id,
      resume_text: resumeText,
      resume_version: resumeRecord.version
    })}`;

    const response = await callOpenRouterLLM(
      userPrompt,
      systemPrompt,
      "resume-chat",
      {}
    );
    return response ?? `Not found in this resume ${resumeRecord.resume_id}.`;
  }
}
