import agentRouter from "./routes/agent";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRouter from "./routes/resume";
import llmRouter from "./routes/together";
import modelsRouter from "./routes/models";

dotenv.config();

console.log("Environment loaded:");
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "SET" : "NOT SET");
console.log("OPENROUTER_API_URL:", process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions");
console.log("OPENROUTER_MODEL:", process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct");

const app = express();
// Try multiple ports to avoid conflicts
const portsToTry = [process.env.PORT ? Number(process.env.PORT) : 3000, 3001, 3002, 3003];
let server;
let currentPort = 0;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", port: portsToTry[currentPort] }));

app.use("/api/resume", resumeRouter);
app.use("/api/llm", llmRouter);
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

startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export default app;
