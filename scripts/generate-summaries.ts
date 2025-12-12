// This script fetches a GitHub user's profile and repositories, sends the combined data to the backend
// for AI analysis across multiple job roles, and saves the generated summaries into data/generated/github_summary.json.



import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function run() {
  const githubUser = process.env.GITHUB_USER;
  if (!githubUser) {
    console.error("Please set GITHUB_USER in env");
    process.exit(1);
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const headers: any = { "Accept": "application/vnd.github.v3+json" };
  if (githubToken) headers["Authorization"] = `token ${githubToken}`;

  // Fetch GitHub profile
  const profileRes = await fetch(`https://api.github.com/users/${githubUser}`, { headers });
  if (!profileRes.ok) {
    console.error("Failed to fetch GitHub profile", profileRes.status);
    process.exit(1);
  }
  const profile = await profileRes.json();

  // Fetch repositories
  const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`, { headers });
  const repos = (await reposRes.json()).map((r: any) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    updated_at: r.updated_at
  }));

  // Build profile text for analysis
  const profileText = `Profile: ${profile.name || githubUser} (${profile.login})\nBio: ${profile.bio || ""}\nCompany: ${profile.company || ""}\nLocation: ${profile.location || ""}\nPublic repos: ${profile.public_repos}\nFollowers: ${profile.followers}\nFollowing: ${profile.following}\n`;

  const reposText = repos.map((r: any) =>
    `- ${r.name}: ${r.description || ""} (${r.language || "Unknown"}, ${r.stars} stars, ${r.forks} forks, updated ${r.updated_at})`
  ).join("\n");

  const fullText = profileText + "\nRepositories:\n" + reposText;

  // Generate summaries for different roles (configurable via ROLES env var)
  const defaultRoles = ["backend-engineer", "security-engineer", "open-source-contributor"];
  const rolesEnv = process.env.ROLES;
  const roles = rolesEnv ? rolesEnv.split(',').map(r => r.trim()) : defaultRoles;
  const summaries: any = {};

  console.log(`Generating summaries for roles: ${roles.join(', ')}`);

  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

  for (const role of roles) {
    console.log(`Generating summary for ${role}...`);

    const resp = await fetch(`${backendUrl}/api/resume/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: fullText, kind: role }),
    });

    if (!resp.ok) {
      console.error(`Backend analyze failed for ${role}`, resp.status);
      continue;
    }

    const result = await resp.json();
    summaries[role] = {
      summary: result.summary,
      generated_at: new Date().toISOString(),
      input_length: fullText.length
    };
  }

  // Save summaries to data/generated/github_summary.json
  const outputDir = path.join(__dirname, "../data/generated");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "github_summary.json");
  fs.writeFileSync(outputPath, JSON.stringify({
    user: githubUser,
    profile: profile,
    repositories: repos,
    summaries: summaries,
    generated_at: new Date().toISOString()
  }, null, 2));

  console.log(`Summaries generated and saved to ${outputPath}`);
}

run().catch((err) => { console.error(err); process.exit(1); });
