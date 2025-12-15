import { Router } from "express";
import { AgentService } from "../services/agentService";
import { getResume } from "../services/resumeService";

const router = Router();

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  try {
    const { resume_id, message } = req.body;

    if (!resume_id || typeof resume_id !== "string") {
      return res.status(400).json({ error: "Please specify resume_id (upload via /api/resume/analyze)." });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Validate resume_id exists
    const resumeRecord = getResume(resume_id);
    if (!resumeRecord) {
      return res.status(404).json({ error: "resume_id not found." });
    }

    const response = await AgentService.chat(message, resumeRecord);
    res.json({ response });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/agent/status
router.get("/status", (_req, res) => {
  res.json({
    ready: AgentService.isReady(),
    availableRoles: AgentService.getAvailableRoles(),
    message: "Agent is ready to chat",
  });
});

export default router;
