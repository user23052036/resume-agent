import dotenv from "dotenv";
import { generateSummary } from "./services/resumeService";

dotenv.config();

async function run() {
  const sample = `Jane Doe\nSoftware Engineer with 6+ years experience building web applications. Skilled in TypeScript, Node.js, React, and cloud infrastructure. Led a team at Acme Corp to build a multi-tenant SaaS product; improved load times by 40% and reduced costs by 20%. Education: B.S. Computer Science.`;

  const summary = await generateSummary(sample, "resume");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
