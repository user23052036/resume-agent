import { Router } from "express";
import { AgentService } from "../services/agentService";
import { getResume } from "../services/resumeStore";
import { handleRouteError } from "../utils/responseHelper";

const router = Router();

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  try {
    const { resume_id, message } = req.body;

    if (!resume_id || typeof resume_id !== "string") {
      return res.json({ response: "Please upload a resume before asking questions." });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Retrieve resume text from store
    const resumeText = await getResume(resume_id);
    if (!resumeText) {
      return res.status(404).json({
        error: "Resume context expired. Please re-upload your resume."
      });
    }

    const response = await AgentService.chat(message, resumeText);
    res.json({ response });
  } catch (err: any) {
    handleRouteError(res, err, "Agent chat");
  }
});

export default router;
