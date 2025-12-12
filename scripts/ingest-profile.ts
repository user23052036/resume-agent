// This script fetches a GitHub user's profile and repos, sends them to the backend AI analyzer,
// and prints the generated summary for quick GitHub profile evaluation.
// Usage: tsx scripts/ingest-profile.ts [role] or set ROLE env var


import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  // Get role from command line argument or environment variable
  const roleArg = process.argv[2]; // First argument after script name
  const roleEnv = process.env.ROLE;
  const role = roleArg || roleEnv || "github-profile";

  console.log(`Using role: ${role}`);

  const githubUser = process.env.GITHUB_USER;
  if (!githubUser) {
    console.error("Please set GITHUB_USER in env");
    process.exit(1);
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const headers: any = { "Accept": "application/vnd.github.v3+json" };
  if (githubToken) headers["Authorization"] = `token ${githubToken}`;

  const profileRes = await fetch(`https://api.github.com/users/${githubUser}`, { headers });
  if (!profileRes.ok) {
    console.error("Failed to fetch GitHub profile", profileRes.status);
    process.exit(1);
  }
  const profile = await profileRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`, { headers });
  const repos = (await reposRes.json()).map((r: any) => ({ name: r.name, description: r.description }));

  // Build a simple text blob and send to the backend analyze endpoint
  const text = `Profile: ${profile.name || githubUser} (${profile.login})\nBio: ${profile.bio || ""}\nRepos:\n` +
    repos.map((r: any) => `- ${r.name}: ${r.description || ""}`).join("\n");

  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  const resp = await fetch(`${backendUrl}/api/resume/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, kind: role }),
  });

  if (!resp.ok) {
    console.error("Backend analyze failed", resp.status);
    process.exit(1);
  }
  const result = await resp.json();
  console.log(JSON.stringify(result, null, 2));
}

run().catch((err) => { console.error(err); process.exit(1); });
