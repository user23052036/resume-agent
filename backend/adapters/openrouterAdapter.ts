import fetch from "node-fetch";
import { ModelResponse } from "../types";

export interface OpenRouterOptions {
  apiKey?: string;
  apiUrl?: string;
  model?: string;
  timeoutMs?: number;
  retries?: number;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clean LLM output by removing special tokens and trimming noise
 */
function cleanLLMOutput(text: string): string {
  return text
    .replace(/<\/?s>/gi, "")
    .replace(/\[(\/)?OUT\]/gi, "")
    .replace(/\[\/?s\]/gi, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\n{3,}/g, "\n\n");
}


/**
 * Call OpenRouter Chat Completion API
 * ALWAYS returns a clean string or throws
 */


export async function callOpenRouterLLM(
  userMessage: string,
  systemPrompt: string,
  purpose: string = "resume",
  opts: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = opts.apiKey || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const apiUrl =
    opts.apiUrl ||
    process.env.OPENROUTER_API_URL ||
    "https://openrouter.ai/api/v1/chat/completions";

  const model =
    opts.model ||
    process.env.OPENROUTER_MODEL ||
    "mistralai/mistral-7b-instruct";

  const timeoutMs = opts.timeoutMs ?? 15_000;
  const retries = opts.retries ?? 2;

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 800,
    temperature: 0.2, // more factual, less noise
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost",
          "X-Title": "Resume Agent",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const rawText = await response.text();

      if (!response.ok) {
        throw new Error(`OpenRouter error ${response.status}: ${rawText}`);
      }

      const json = JSON.parse(rawText);

      const content =
        json?.choices?.[0]?.message?.content ??
        json?.result ??
        json?.output;

      if (typeof content !== "string") {
        throw new Error("Invalid response format from OpenRouter");
      }

      const cleaned = cleanLLMOutput(content);

      if (!cleaned) {
        console.warn("OpenRouter returned content that became empty after cleaning. Raw response:", rawText);
        
        // Retry once with stronger system prompt if this is the first attempt
        if (attempt === 0) {
          const strongerSystemPrompt = systemPrompt + "\n\nIMPORTANT: You MUST return a non-empty answer. Answer ONLY from the resume. If the resume lacks the information, say so clearly.";
          
          return await callOpenRouterLLM(
            userMessage,
            strongerSystemPrompt,
            purpose,
            { ...opts, retries: 0 } // Prevent infinite recursion
          );
        }
        
        return "The resume does not contain enough information to answer this question.";
      }

      return cleaned;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await sleep(500 * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to call OpenRouter");
}

/**
 * Call OpenRouter Chat Completion API with detailed response metadata
 * Returns a ModelResponse object with success status and metadata
 */
export async function callOpenRouterLLMWithResponse(
  userMessage: string,
  systemPrompt: string,
  purpose: string = "resume",
  opts: OpenRouterOptions = {}
): Promise<ModelResponse> {
  const startTime = Date.now();
  const model = opts.model || process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct";

  try {
    const response = await callOpenRouterLLM(userMessage, systemPrompt, purpose, opts);
    const responseTime = Date.now() - startTime;

    return {
      success: true,
      response,
      model,
      responseTime
    };
  } catch (err) {
    const responseTime = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return {
      success: false,
      error: errorMessage,
      model,
      responseTime
    };
  }
}
