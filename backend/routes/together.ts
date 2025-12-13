import { Router } from "express";
import { callOpenRouterLLM } from "../adapters/openrouterAdapter";

const router = Router();

// POST /api/llm/test
// body: { input: string, instruction?: string, kind?: string, apiKey?: string, apiUrl?: string, model?: string }
router.post("/test", async (req, res) => {
  try {
    const { input, instruction, kind, apiKey, apiUrl, model } = req.body;
    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'input' in body" });
    }

    const effectiveApiKey = apiKey || process.env.OPENROUTER_API_KEY;

    if (!effectiveApiKey) {
      return res.status(400).json({ error: "OPENROUTER_API_KEY not configured in environment and not provided in body" });
    }

    const instr = instruction || "Summarize the text concisely in 2-3 sentences.";
    const result = await callOpenRouterLLM(input, instr, kind, { apiKey: effectiveApiKey, apiUrl, model, retries: 2, timeoutMs: 15000 });
    return res.json({ result });
  } catch (err: any) {
    console.error("Error calling OpenRouter LLM", err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

export default router;
