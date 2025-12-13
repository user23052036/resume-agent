import { callOpenRouterLLMWithResponse } from "../adapters/openrouterAdapter";
import { ModelResponse } from "../types";
import { modelRanker } from "./modelRanker";

/**
 * Generate a summary using OpenRouter LLM when configured,
 * otherwise fall back to a heuristic local summarizer.
 */
export async function generateSummary(text: string, kind?: string): Promise<{ summary: string; engine: string; model?: string; responseTime?: number }> {
  // Input validation
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error("Invalid input: text must be a non-empty string");
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      // Get the best model for this task based on rankings
      const bestModel = modelRanker.getBestModel(kind);
      const instruction = `You are a professional resume summarizer. Summarize the following resume text into a concise, professional summary of 2-3 sentences highlighting key skills and experience.`;

      const result: ModelResponse = await callOpenRouterLLMWithResponse(text, instruction, kind, {
        apiKey,
        retries: 2,
        timeoutMs: 15000,
        model: bestModel
      });

      // Evaluate the response and update model rankings
      if (result.success && result.response && result.response.length > 0) {
        await modelRanker.evaluateResponse(result, kind);

        return {
          summary: result.response,
          engine: "openrouter",
          model: result.model,
          responseTime: result.responseTime
        };
      } else if (result.error) {
        console.warn("Error calling OpenRouter LLM:", result.error);
        // Even on error, we evaluate to track error rates
        await modelRanker.evaluateResponse(result, kind);
      }
    } catch (err: any) {
      console.warn("Error calling OpenRouter LLM, falling back to local summary.", err.message);
    }
  }

  // Local heuristic summarizer: take first 3 sentences or first 300 chars
  const cleanedText = text.replace(/\n+/g, " ").trim();
  const sentences = cleanedText.split(/(?<=[.?!])\s+/).filter(Boolean);
  const selected = sentences.slice(0, 3).join(" ");

  if (selected.length > 30) {
    return { summary: selected, engine: "local-fallback" };
  }

  const trimmed = cleanedText.slice(0, 300);
  return { summary: trimmed + (trimmed.length < cleanedText.length ? "…" : ""), engine: "local-fallback" };
}
