import express from "express";
import { modelRanker } from "../services/modelRanker";
import { callOpenRouterLLMWithResponse } from "../adapters/openrouterAdapter";

const router = express.Router();

/**
 * GET /api/models/rank
 * Get current model rankings
 */
router.get("/rank", (req, res) => {
  try {
    const rankings = modelRanker.getModelRankings();
    res.json({
      success: true,
      rankings,
      bestModel: rankings.length > 0 ? rankings[0].modelName : "mistralai/mistral-7b-instruct"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get model rankings"
    });
  }
});

/**
 * GET /api/models/history/:modelName
 * Get evaluation history for a specific model
 */
router.get("/history/:modelName", (req, res) => {
  try {
    const { modelName } = req.params;
    const history = modelRanker.getModelHistory(modelName);
    res.json({
      success: true,
      modelName,
      evaluations: history
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get model history"
    });
  }
});

/**
 * POST /api/models/evaluate
 * Evaluate a specific model response
 */
router.post("/evaluate", async (req, res) => {
  try {
    const { text, model, kind, instruction } = req.body;

    if (!text || !model) {
      return res.status(400).json({
        success: false,
        error: "text and model are required"
      });
    }

    const result = await callOpenRouterLLMWithResponse(text, instruction || "Evaluate this text", kind, {
      model
    });

    const evaluation = await modelRanker.evaluateResponse(result, kind);

    res.json({
      success: true,
      evaluation,
      response: result.response,
      model: result.model
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to evaluate model"
    });
  }
});

/**
 * POST /api/models/reset
 * Reset all model rankings (for testing)
 */
router.post("/reset", (req, res) => {
  try {
    modelRanker.reset();
    res.json({
      success: true,
      message: "Model rankings and history have been reset"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to reset model rankings"
    });
  }
});

export default router;
