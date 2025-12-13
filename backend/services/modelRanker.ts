import { ModelResponse } from "../types";

/**
 * Model evaluation and ranking system
 * This provides Oumi-like functionality for AI model ranking and response evaluation
 */
export interface ModelEvaluation {
  modelName: string;
  responseQuality: number; // 0-1 scale
  responseTime: number; // ms
  confidenceScore: number; // 0-1 scale
  errorRate: number; // 0-1 scale
  timestamp: string;
  success: boolean;
}

export interface ModelRanking {
  modelName: string;
  overallScore: number; // 0-1 scale
  evaluations: number;
  avgResponseTime: number;
  lastUsed: string;
}

export class ModelRanker {
  private modelHistory: ModelEvaluation[] = [];
  private modelRankings: Record<string, ModelRanking> = {};

  /**
   * Evaluate a model response and update rankings
   */
  async evaluateResponse(
    response: ModelResponse,
    kind?: string
  ): Promise<ModelEvaluation> {
    const evaluation: ModelEvaluation = {
      modelName: response.model,
      responseQuality: this.calculateQualityScore(response.response),
      responseTime: response.responseTime,
      confidenceScore: this.calculateConfidenceScore(response.response, kind),
      errorRate: this.calculateErrorRate(response.model),
      timestamp: new Date().toISOString(),
      success: response.success
    };

    this.modelHistory.push(evaluation);
    this.updateModelRankings(evaluation);

    return evaluation;
  }

  /**
   * Get the best model for a specific task
   */
  getBestModel(kind?: string): string {
    const models = Object.values(this.modelRankings);

    if (models.length === 0) {
      return "mistralai/mistral-7b-instruct"; // Default model
    }

    // Sort by overall score (descending)
    const ranked = [...models].sort((a, b) => b.overallScore - a.overallScore);

    return ranked[0]?.modelName || "mistralai/mistral-7b-instruct";
  }

  /**
   * Get all model rankings
   */
  getModelRankings(): ModelRanking[] {
    return Object.values(this.modelRankings).sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Get evaluation history for a specific model
   */
  getModelHistory(modelName: string): ModelEvaluation[] {
    return this.modelHistory
      .filter(evaluation => evaluation.modelName === modelName)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Calculate response quality score (0-1)
   */
  private calculateQualityScore(response: string): number {
    if (!response || response.length === 0) return 0;

    // Factors that contribute to quality
    const sentenceCount = (response.match(/[.!?]+/g) || []).length;
    const wordCount = response.split(/\s+/).length;
    const hasCompleteSentences = sentenceCount > 0;
    const lengthScore = Math.min(1, wordCount * 0.01); // Max 100 words = 1.0
    const structureScore = hasCompleteSentences ? 0.3 : 0;
    const diversityScore = this.calculateLexicalDiversity(response) * 0.2;

    // Overall quality score (0-1)
    return Math.min(1, lengthScore + structureScore + diversityScore);
  }

  /**
   * Calculate confidence score based on content relevance
   */
  private calculateConfidenceScore(response: string, kind?: string): number {
    if (!response || response.length === 0) return 0;

    // Base confidence from response quality
    let confidence = this.calculateQualityScore(response) * 0.5;

    // Add kind-specific confidence boosters
    if (kind) {
      const kindTerms: Record<string, string[]> = {
        "backend-engineer": ["backend", "server", "API", "database", "scalability"],
        "frontend-engineer": ["frontend", "UI", "UX", "React", "JavaScript"],
        "security-engineer": ["security", "vulnerability", "encryption", "compliance"],
        "open-source-contributor": ["open source", "community", "contributions", "collaboration"]
      };

      const terms = kindTerms[kind] || [];
      const termMatches = terms.filter(term =>
        response.toLowerCase().includes(term.toLowerCase())
      ).length;

      confidence += Math.min(0.5, termMatches * 0.1);
    }

    return Math.min(1, confidence);
  }

  /**
   * Calculate error rate for a model
   */
  private calculateErrorRate(modelName: string): number {
    const modelEvaluations = this.modelHistory.filter(evaluation => evaluation.modelName === modelName);
    if (modelEvaluations.length === 0) return 0;

    const failedEvaluations = modelEvaluations.filter(evaluation => !evaluation.success).length;
    return failedEvaluations / modelEvaluations.length;
  }

  /**
   * Calculate lexical diversity (unique words / total words)
   */
  private calculateLexicalDiversity(text: string): number {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length === 0) return 0;

    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
  }

  /**
   * Update model rankings based on new evaluation
   */
  private updateModelRankings(evaluation: ModelEvaluation) {
    const { modelName, responseQuality, responseTime, confidenceScore, errorRate, success } = evaluation;

    // Initialize or update model ranking
    if (!this.modelRankings[modelName]) {
      this.modelRankings[modelName] = {
        modelName,
        overallScore: 0,
        evaluations: 0,
        avgResponseTime: responseTime,
        lastUsed: evaluation.timestamp
      };
    }

    const ranking = this.modelRankings[modelName];
    ranking.evaluations += 1;
    ranking.lastUsed = evaluation.timestamp;

    // Update average response time
    ranking.avgResponseTime =
      (ranking.avgResponseTime * (ranking.evaluations - 1) + responseTime) / ranking.evaluations;

    // Calculate overall score (weighted average)
    // 50% response quality, 30% speed, 20% confidence, penalize errors
    const errorPenalty = errorRate * 0.5; // Max 50% penalty for 100% error rate
    ranking.overallScore = Math.max(0,
      (responseQuality * 0.5 +
       (1000 / Math.max(100, responseTime)) * 0.3 +
       confidenceScore * 0.2) - errorPenalty
    );

    // Success bonus
    if (success) {
      ranking.overallScore = Math.min(1, ranking.overallScore * 1.1);
    }
  }

  /**
   * Reset all rankings and history (for testing)
   */
  reset(): void {
    this.modelHistory = [];
    this.modelRankings = {};
  }
}

// Singleton instance for easy access
export const modelRanker = new ModelRanker();
