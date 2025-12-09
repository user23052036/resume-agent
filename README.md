# AI Resume & Portfolio Agent

An interactive, AI-powered resume and portfolio agent.

This project is built for the **AI AGENTS ASSEMBLE** hackathon by WeMakeDevs.  
It showcases our skills, projects, and growth using a hybrid **portfolio + chat agent** interface and integrates all key sponsor tools:

- **Cline** – autonomous coding workflows to scaffold & refactor the codebase.
- **Kestra** – workflows that ingest and summarize my GitHub / profile data.
- **Vercel** – fast deployment of the web app.
- **Oumi** – ranking and evaluating agent responses.
- **CodeRabbit** – AI PR reviews and code quality checks.
- **Together AI** – LLM inference powering the agent.

---

## 🔍 What This Project Does

### Problem

Static resumes and plain GitHub profiles don’t show the full story.  
Recruiters, mentors, and peers often have to dig through multiple links to understand:

- What have you actually built?
- What skills do you have in systems, networking, and security?
- How have you grown over time (CTFs, DSA, labs, projects)?

### Solution

This project is a **personal resume/portfolio agent** that:

- Lets users **chat with my profile** instead of reading a static CV.
- Dynamically **tailors summaries** for different roles (backend engineer, security engineer, etc.).
- Explains the **architecture and impact** of each project.
- Uses workflows and LLMs to keep my profile **up-to-date** and **rank the best answers**.


---

## ✨ Key Features

### 1. Chat With Profile
- Chat UI embedded in the portfolio.
- Ask questions like:
  - “Summarize X-person's backend experience.”
  - “Explain his best networking project.”
  - “Give me a 2-sentence recruiter blurb for a security role.”
- Agent adapts tone and depth based on **user role** (recruiter / mentor / peer).


### 2. Role-Based Summaries
- One-click presets for:
  - **Backend / Systems Engineer**
  - **Security / Cybersecurity Engineer**
  - **GSoC / Open Source Contributor**
- Agent explains my profile differently for each target role.

### 3. Growth & Learning Tracker
- High-level view of:
  - Competitive programming and DSA practice
  - CTF / security learning progress
- Planned: AI-generated **study plans** and next-step recommendations.

---

## Architecture Overview

> **Stack (planned / implemented):**
>
> - **Frontend:** Next.js (React) + TypeScript + Tailwind CSS  
> - **Backend / API:** Next.js API routes or lightweight Node.js/Express / FastAPI service  
> - **LLM Inference:** Together AI (primary), optionally Oumi models  
> - **Workflows:** Kestra  
> - **Deployment:** Vercel  
> - **Code Review:** CodeRabbit  
> - **Dev Automation:** Cline CLI  

### High-Level Flow

1. **User** opens portfolio site (Vercel).
2. **Frontend (Next.js)** renders:
   - Landing page (bio, skills, projects)
   - Chat component
3. User sends a question → **Chat component** calls `/api/agent`.
4. **API layer**:
   - Loads structured data from `/data/profile.json` and `/data/projects.json`.
   - Optionally pulls fresh summaries from Kestra outputs.
   - Builds a prompt and calls **Together AI / Oumi**.
   - Returns a response + metadata (referenced projects, skills).
5. **Frontend** displays the answer and highlights relevant projects.
6. **Kestra** runs scheduled workflows in the background:
   - Fetches GitHub stats / repos.
   - Summarizes changes and writes back into `/data/generated/`.
7. **CodeRabbit** reviews PRs as I iterate.
8. **Cline** is used locally to scaffold code, refactor modules, and create tests.

---

## 📁 Repository Structure (Planned)

```text
.
├── frontend/                  # Next.js app (pages, components, styles)
│   ├── app/ or pages/
│   ├── components/
│   │   ├── ChatPanel.tsx
│   │   ├── ProjectList.tsx
│   │   └── RoleSelector.tsx
│   └── styles/
│
├── agents/                    # Agent logic & prompt templates
│   ├── system-prompts/
│   │   └── resume-agent.md
│   └── config/
│       └── agent-config.json
│
├── data/                      # Structured profile & project data
│   ├── profile.json
│   ├── projects.json
│   └── generated/             # Summaries produced by Kestra workflows
│       └── github_summary.json
│
├── workflows/                 # Kestra workflows
│   └── github_profile.yml
│
├── scripts/                   # Helper scripts (possibly generated with Cline)
│   └── generate-summaries.ts
│
├── .coderabbit.yml            # CodeRabbit configuration
├── .env.example               # Env variable template
├── package.json
└── README.md
