import { callOpenRouterLLM } from "../adapters/openrouterAdapter";

export class AgentService {
  /**
   * Stateless chat handler.
   * Resume context is provided per request (Vercel-safe).
   */
  static async chat(message: string, resumeText: string): Promise<string> {
    // Defensive guard — never throw here (breaks UX)
    if (!resumeText || resumeText.trim().length < 10) {
      console.warn("AgentService.chat called with empty resume text");
      return "Not found in this resume.";
    }

    console.log(
      `Processing chat request. Resume text length = ${resumeText.length}`
    );

    /**
     * System prompt:
     * - Hard constraint: ONLY use provided resume
     * - Deterministic fallback response
     */
      const systemPrompt = `
      You are a resume Q&A assistant.

      STRICT RULES:
      - Answer ONLY using facts explicitly written in the resume text.
      - Do NOT infer strengths, weaknesses, timelines, or experience.
      - Do NOT summarize or rephrase beyond what is written.
      - Do NOT guess.

      If the answer is not explicitly present in the resume, reply EXACTLY:
      "Not found in this resume."

      FORMATTING RULES:
      - Use bullet points for lists.
      - Do NOT add tags like [OUT], [/OUT], [/s], or similar.
      - Do NOT explain your reasoning.
      `.trim();


    /**
     * User prompt:
     * - Plain text (avoid JSON noise)
     * - Clear separation between question and context
     */
    const userPrompt = `
QUESTION:
${message}

RESUME CONTENT:
${resumeText.trim()}
`.trim();

    const response = await callOpenRouterLLM(
      userPrompt,
      systemPrompt,
      "resume-chat",
      {}
    );

    // Always return a string — never undefined
    return response || "Not found in this resume.";
  }
}
