import { Router } from "express";
import { AgentService } from "../services/agentService";
import { getResume } from "../services/resumeStore";

const router = Router();

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  try {
    const { resume_id, message } = req.body;

    if (!resume_id || typeof resume_id !== "string") {
      return res.status(400).json({ error: "resume_id is required" });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Retrieve resume text from store
    const resumeText = getResume(resume_id);
    if (!resumeText) {
      return res.status(404).json({
        error: "Resume context expired. Please re-upload the resume."
      });
    }

    const response = await AgentService.chat(message, resumeText);
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
