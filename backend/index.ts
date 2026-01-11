import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import express from "express";
import cors from "cors";

import { initRedis } from "./services/redisClient";

import agentRouter from "./routes/agent";
import resumeRouter from "./routes/resume";
import modelsRouter from "./routes/models";

const app = express();
// Try multiple ports to avoid conflicts
const portsToTry = [process.env.PORT ? Number(process.env.PORT) : 3000, 3001, 3002, 3003];
let server;
let currentPort = 0;

app.use(cors());

/**
 * IMPORTANT:
 * Increase request body size.
 * Needed because resume_text (PDF extracted text) can be large.
 * This fixes "No response generated" issues on localhost & Vercel.
 */

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", port: portsToTry[currentPort] }));

app.use("/api/resume", resumeRouter);
app.use("/api/models", modelsRouter);
app.use("/api/agent", agentRouter);

// Enhanced error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong"
  });
});

// Try to start server on available port
function startServer(portIndex: number = 0) {
  if (portIndex >= portsToTry.length) {
    console.error("All ports are in use. Cannot start server.");
    process.exit(1);
  }

  currentPort = portIndex;
  const port = portsToTry[portIndex];

  server = app.listen(port, () => {
    console.log(`Resume-agent backend listening on http://localhost:${port}`);
  });

  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use, trying next port...`);
      startServer(portIndex + 1);
    } else {
      console.error("Server error:", error);
      process.exit(1);
    }
  });
}

(async () => {
  console.log("[BOOT] NODE_ENV:", process.env.NODE_ENV || "development");
  console.log("[BOOT] REDIS_URL:", process.env.REDIS_URL ? "SET" : "NOT SET");
  try {
    await initRedis();

    if (process.env.NODE_ENV !== "production") {
      const { getRedis, isUsingRedis } = await import("./services/redisClient");

      app.get("/redis-test", async (_req, res) => {
        if (isUsingRedis()) {
          const r = getRedis();
          await r.set("resume_agent_test_ping", "pong");
          const v = await r.get("resume_agent_test_ping");
          return res.json({ redis: true, value: v ?? null });
        }
        return res.json({ redis: false, message: "Memory fallback active" });
      });
    }

    startServer();
  } catch (err) {
    console.error("[BOOT] Failed to initialize required services. Exiting.", err);
    process.exit(1);
  }
})();


// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export default app;
