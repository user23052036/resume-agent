import fetch from "node-fetch";
import { ResumeData, AgentConfig, RoleSummary, AgentResult, ResumeAgent } from "./types";

/**
 * Default roles for which resume summaries will be generated
 */
const DEFAULT_ROLES = [
  "backend-engineer",
  "frontend-engineer",
  "full-stack-developer",
  "devops-engineer"
];

/**
 * SimpleResumeAgent - A resume processing agent that generates role-specific summaries
 * and evaluates them using Oumi for quality ranking.
 */
export class SimpleResumeAgent implements ResumeAgent {
  private config: AgentConfig;

  /**
   * Creates a new SimpleResumeAgent instance
   * @param config Agent configuration including backend URL and timeout settings
   */
  constructor(config: AgentConfig) {
    this.config = {
      backendUrl: config.backendUrl || "http://localhost:3000",
      timeout: config.timeout || 30000,
      ...config
    };
  }

  /**
   * Main processing method that generates role-specific summaries and ranks them
   * @param data Resume data containing text and source information
   * @returns AgentResult with processed summaries and metadata
   */
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

    // Use Oumi to evaluate and rank the summaries
    const rankedSummaries = await this.rankSummariesWithOumi(summaries, data.text);

    return {
      summaries: rankedSummaries,
      raw_data: data,
      processed_at: new Date().toISOString()
    };
  }

  /**
   * Generates a role-specific summary by calling the backend API
   * @param text Resume text to analyze
   * @param role Target role for the summary
   * @returns Generated summary text
   * @throws Error if backend API call fails or returns invalid response
   */
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

  /**
   * Saves processing results to the data folder structure
   * @param result AgentResult containing summaries and raw data to save
   */
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

  /**
   * Evaluates and ranks summaries using Oumi quality assessment
   * @param summaries Array of role summaries to evaluate
   * @param originalText Original resume text for comparison
   * @returns Ranked summaries with Oumi scores and confidence levels
   */
  async rankSummariesWithOumi(summaries: RoleSummary[], originalText: string): Promise<RoleSummary[]> {
    try {
      const { Oumi } = require('oumi');

      // Evaluate each summary using Oumi
      const evaluations = await Promise.all(
        summaries.map(async (summary) => {
          const evaluation = await Oumi.evaluate({
            input: originalText,
            output: summary.summary,
            task: 'resume-summarization',
            criteria: ['relevance', 'accuracy', 'conciseness', 'professionalism']
          });

          return {
            ...summary,
            oumi_score: evaluation.score,
            confidence: evaluation.score / 100 // Update confidence based on Oumi score
          };
        })
      );

      // Sort by Oumi score (highest first)
      evaluations.sort((a, b) => (b.oumi_score || 0) - (a.oumi_score || 0));

      // Assign ranks
      evaluations.forEach((summary, index) => {
        summary.oumi_rank = index + 1;
      });

      console.log(`Oumi evaluation completed. Ranked ${evaluations.length} summaries.`);
      return evaluations;
    } catch (error) {
      console.warn('Oumi evaluation failed, returning original summaries:', error);
      // Return original summaries if Oumi fails
      return summaries;
    }
  }
}

/**
 * Factory function to create a configured SimpleResumeAgent instance
 * @param config Agent configuration
 * @returns Configured ResumeAgent instance
 */
export function createResumeAgent(config: AgentConfig): ResumeAgent {
  return new SimpleResumeAgent(config);
}
