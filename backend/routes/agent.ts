import { Router } from "express";
import { AgentService } from "../services/agentService";

const router = Router();

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  try {
    const { resume_id, resume_text, message } = req.body;

    if (!resume_id || typeof resume_id !== "string") {
      return res.status(400).json({ error: "resume_id is required" });
    }

    if (!resume_text || typeof resume_text !== "string" || resume_text.trim().length === 0) {
      return res.status(400).json({ error: "resume_text is required and cannot be empty" });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await AgentService.chat(message, resume_text);
    res.json({ response });
  } catch (err: any) {
  console.error("Agent chat error:", err);

  return res.json({
    response: "Not found in this resume.",
    error: err?.message,
  });
}
});

export default router;
