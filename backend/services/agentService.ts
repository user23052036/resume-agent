import fs from "fs";
import path from "path";
import { callOpenRouterLLM } from "../adapters/openrouterAdapter";

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

  static async chat(message: string): Promise<string> {
    const resumePath = path.join(
      process.cwd(),
      "data/raw/resume-content.json"
    );

    if (!fs.existsSync(resumePath)) {
      throw new Error("Resume not found. Please upload a resume PDF first.");
    }

    const raw = JSON.parse(fs.readFileSync(resumePath, "utf-8"));
    const resumeText = raw.extracted_text;

    const systemPrompt = `
You are an AI resume analyst.

RESUME CONTENT:
${resumeText}

INSTRUCTIONS:
- Answer using ONLY the resume content above
- You may infer obvious information (name, skills, experience) from the content
- Do NOT invent information not reasonably implied from the resume
- If information is truly missing, say so clearly
- Format responses clearly and professionally:
  * Use bullet points for lists (skills, experience, etc.)
  * Structure answers with clear sections when appropriate
  * Keep responses concise but complete
  * Use proper grammar and professional language
 `.trim();

  const response = await callOpenRouterLLM(
      message,
      systemPrompt,
      "resume-chat",
      {}
    );
    return response ?? "No response generated from resume.";
  }
}
