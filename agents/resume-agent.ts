import fetch from "node-fetch";
import { ResumeData, AgentConfig, RoleSummary, AgentResult, ResumeAgent } from "./types";

const DEFAULT_ROLES = [
  "backend-engineer",
  "frontend-engineer",
  "full-stack-developer",
  "devops-engineer"
];

export class SimpleResumeAgent implements ResumeAgent {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = {
      backendUrl: config.backendUrl || "http://localhost:3000",
      timeout: config.timeout || 30000,
      ...config
    };
  }

  async processResume(data: ResumeData): Promise<AgentResult> {
    console.log(`Processing resume from ${data.source} source`);

    // Generate summaries for default roles
    const summaries: RoleSummary[] = [];

    for (const role of DEFAULT_ROLES) {
      try {
        const summary = await this.generateRoleSummary(data.text, role);
        summaries.push({
          role,
          summary,
          generated_at: new Date().toISOString(),
          confidence: 0.8 // Basic confidence score
        });
      } catch (error) {
        console.error(`Failed to generate summary for ${role}:`, error);
        // Continue with other roles even if one fails
      }
    }

    return {
      summaries,
      raw_data: data,
      processed_at: new Date().toISOString()
    };
  }

  async generateRoleSummary(text: string, role: string): Promise<string> {
    const url = `${this.config.backendUrl}/api/resume/analyze`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        kind: role
      }),
      timeout: this.config.timeout
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.summary) {
      throw new Error("No summary returned from backend");
    }

    return result.summary;
  }

  // Utility method to save results to data folder
  async saveResults(result: AgentResult): Promise<void> {
    const fs = require("fs");
    const path = require("path");

    // Save raw resume content
    const rawDataPath = path.join(__dirname, "../data/raw/resume-content.json");
    const rawData = {
      extracted_text: result.raw_data.text,
      source: result.raw_data.source,
      extracted_at: result.raw_data.metadata?.extracted_at || new Date().toISOString(),
      metadata: result.raw_data.metadata || {}
    };
    fs.writeFileSync(rawDataPath, JSON.stringify(rawData, null, 2));

    // Save summaries
    const summariesDir = path.join(__dirname, "../data/generated/role-summaries");
    if (!fs.existsSync(summariesDir)) {
      fs.mkdirSync(summariesDir, { recursive: true });
    }

    for (const summary of result.summaries) {
      const summaryPath = path.join(summariesDir, `${summary.role}.json`);
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    }

    console.log(`Results saved to data folder`);
  }
}

// Factory function to create agent
export function createResumeAgent(config: AgentConfig): ResumeAgent {
  return new SimpleResumeAgent(config);
}
