import { Router } from "express";
import { AgentService } from "../services/agentService";

const router = Router();

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await AgentService.chat(message);
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
