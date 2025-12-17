// backend/services/agentService.ts
import { callOpenRouterLLM } from "../adapters/openrouterAdapter";

const MAX_RESUME_CHARS = 20000; // FIX: truncate very long resumes to avoid LLM input limits

export class AgentService {
  // Keep a small status API so routes can check readiness.
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

  /**
   * Stateless chat handler.
   * Resume context is provided per request (Vercel-safe).
   */
  static async chat(message: string, resumeText: string): Promise<string> {
    // Robust resume content safety guard
    const cleanedResume = resumeText?.trim() || "";
    if (!cleanedResume) {
      return "The resume content could not be read or is empty.";
    }

    // FIX: truncate resume to a safe maximum size before sending to LLM
    const resumeToSend =
      cleanedResume.length > MAX_RESUME_CHARS
        ? cleanedResume.slice(0, MAX_RESUME_CHARS)
        : cleanedResume;

    const systemPrompt = `
You are a resume Q&A assistant.

RULES:
- You MUST NOT return empty or whitespace-only responses.
- Answer ONLY using information from the resume.
- If the information is missing, explicitly say so.
- When listing skills, ALWAYS use bullet points.
- Keep answers concise and factual.
- Do NOT hallucinate or invent details.

RESUME CONTEXT:
===== RESUME START =====
${resumeToSend}
===== RESUME END =====

If the resume does not contain information relevant to the question,
reply EXACTLY:
"Not found in this resume."

CLARIFICATIONS:
- Interpreting section headers is allowed.
- Grouping listed items is allowed.
- Rephrasing bullet points into short sentences is allowed.

FORMATTING:
- Use bullet points for lists.
- Do NOT add tags like [OUT], [/OUT], [/s].
- Do NOT explain your reasoning.
`.trim();



    // User prompt with clear separators
    const userPrompt = `
QUESTION:
${message}

RESUME CONTENT:
${resumeToSend}
`.trim();

    try {
      const response = await callOpenRouterLLM(
        userPrompt,
        systemPrompt,
        "resume-chat",
        {}
      );

      // Cleaned response passes back to the caller
      return response.trim();
    } catch (err: any) {
      // FIX: handle timeouts / network errors gracefully and log
      const msg = err?.message?.toLowerCase?.() || "";

      console.error("callOpenRouterLLM failed:", err);

      if (msg.includes("timeout") || msg.includes("aborted") || msg.includes("failed to call openrouter")) {
        // LLM timed out or aborted — caller could map this to 502 if desired
        return "LLM timeout";
      }

      // Generic fallback (do not leak internal errors to users)
      return "Not found in this resume.";
    }
  }
}
