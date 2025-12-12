# AI Resume & Portfolio Agent

An interactive, AI-powered resume and portfolio agent that transforms static CVs into dynamic, conversational experiences. Built for the **AI AGENTS ASSEMBLE** hackathon by WeMakeDevs, this project showcases a comprehensive **portfolio + multi-agent system** with integrated chat interface.

**🚀 Live Demo**: [Portfolio Website](https://your-portfolio.vercel.app)

**⚡ Key Innovation**: Interactive AI agents that understand your profile and provide personalized insights for different career paths.

This project integrates all key sponsor tools:

- **OpenRouter** – LLM inference for intelligent analysis
- **Kestra** – automated GitHub profile ingestion and data workflows
- **Vercel** – seamless deployment and hosting
- **Oumi** – AI model ranking and response evaluation
- **CodeRabbit** – automated code reviews and quality assurance
- **Cline** – autonomous development workflows and code scaffolding

---

## 🔍 What This Project Does

### Problem

Traditional static resumes and GitHub profiles fail to tell the complete story. Recruiters, mentors, and peers must navigate multiple platforms to understand:

- **Project Impact**: What you've actually built and its technical significance
- **Skill Depth**: Your capabilities in systems, networking, and security domains
- **Growth Trajectory**: How you've evolved through CTFs, DSA practice, and real-world projects
- **Role Fit**: How your experience aligns with specific job requirements

### Solution

This project is a **comprehensive AI-powered resume ecosystem** that:

- **Conversational Interface**: Chat with profiles instead of reading static documents
- **Role-Based Intelligence**: Dynamic summaries tailored for specific career paths
- **Project Deep-Dives**: AI explanations of architecture, challenges, and impact
- **Continuous Learning**: Automated workflows keep profiles updated and relevant
- **Multi-Agent System**: Specialized agents handle different aspects of profile analysis

---

## ✨ Key Features

### 1. Intelligent Chat Interface

- **Conversational Profile Analysis**: Natural language queries about skills, experience, and projects
- **Role-Based Responses**: Adapts communication style based on user type (recruiter, mentor, peer)
- **Real-Time Processing**: Instant AI-generated insights from profile data
- **Context-Aware**: Maintains conversation context for follow-up questions

### 2. Multi-Agent Profile Analysis

- **Profile Analyzer Agent**: Extracts and structures information from GitHub and resume data
- **Role Matcher Agent**: Tailors summaries for specific career paths (backend, security, frontend, etc.)
- **Content Generator Agent**: Creates compelling narratives and project explanations
- **Learning Tracker Agent**: Monitors growth patterns and skill development over time

### 3. Automated Data Intelligence

- **GitHub Integration**: Automatically ingests repository data, commit history, and project metrics
- **Dynamic Summaries**: AI-generated role-specific summaries using OpenRouter LLM
- **Continuous Updates**: Kestra workflows maintain data freshness
- **PDF Processing**: Extract and analyze resume content from PDF documents

### 4. Advanced Analytics & Insights

- **Skill Assessment**: AI-powered evaluation of technical competencies
- **Project Impact Analysis**: Deep-dive into architecture, challenges, and outcomes
- **Career Trajectory**: Growth tracking through competitive programming, CTFs, and projects
- **Role Compatibility**: Matching profiles to job requirements and opportunities

---

## 🏗️ System Architecture

### Technology Stack

**Frontend Layer:**

- **Next.js 14+** with App Router for modern React development
- **TypeScript** for type-safe development
- **Tailwind CSS** for responsive, utility-first styling
- **Shadcn/ui** for consistent, accessible UI components

**Backend Layer:**

- **Node.js/Express** RESTful API server
- **OpenRouter Integration** for LLM-powered analysis
- **PDF Processing** with pdf-parse for document extraction
- **GitHub API Integration** for profile data ingestion

**Agent System (Future Implementation):**

- **Multi-Agent Architecture** with specialized roles
- **Agent Communication Protocols** for coordinated analysis
- **Learning & Adaptation** capabilities from user interactions
- **Model Ranking** with Oumi for response quality optimization

**Data & Workflows:**

- **Kestra Workflows** for automated data processing
- **Structured Data Storage** in JSON format
- **GitHub Webhooks** for real-time updates
- **Vercel Edge Functions** for serverless deployment

**External Integrations:**

- **OpenRouter** LLM inference engine
- **Vercel** deployment and hosting platform
- **CodeRabbit** automated code review
- **GitHub** version control and profile data

### System Architecture Diagram

```bash
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Chat Panel    │  │  Project Cards  │  │  Role Selector  │ │
│  │                 │  │                 │  │                 │ │
│  │ [Chat Input]    │  │ [Project List]  │  │ [Role Buttons]  │ │
│  │ [AI Responses]  │  │ [Tech Details]  │  │ [Filters]       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│                    Next.js 14+ Application                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  API Routes  │  Components  │  Hooks  │  Utils  │  Types    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ HTTP REST
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                            │
│                    Node.js/Express Server                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Resume    │  │   PDF       │  │   GitHub    │  │  LLM    │ │
│  │ Controller  │  │ Processor   │  │  Service    │  │ Service │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ External APIs
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ OpenRouter  │  │ GitHub API  │  │   Vercel    │  │   Kestra    │
│   LLM API   │  │    Data     │  │ Deployment  │  │  Workflows  │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
                                │
                                ▼ Data Storage
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Profile   │  │  Projects   │  │  Generated  │  │ Scripts │ │
│  │     Data    │  │    Data     │  │ Summaries   │  │   &     │ │
│  │             │  │             │  │             │  │  Utils  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ Future Implementation
┌─────────────────────────────────────────────────────────────────┐
│                        AGENT SYSTEM                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Profile   │  │   Role      │  │   Content   │  │ Learning│ │
│  │  Analyzer   │  │   Matcher   │  │  Generator  │  │ Tracker │ │
│  │    Agent    │  │    Agent    │  │    Agent    │  │  Agent  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

### Complete Directory Structure

```bash
resume-agent/
├── frontend/                          # Next.js Frontend Application
│   ├── app/                          # App Router pages
│   │   ├── layout.tsx                # Root layout component
│   │   ├── page.tsx                  # Home page component
│   │   ├── globals.css               # Global styles
│   │   └── favicon.ico               # Application icon
│   ├── components/                   # React Components
│   │   ├── ChatPanel.tsx             # Chat interface component
│   │   ├── Header.tsx                # Site header component
│   │   ├── HeroSection.tsx           # Hero section component
│   │   ├── NavLinks.tsx              # Navigation component
│   │   ├── ProjectCard.tsx           # Project display component
│   │   ├── RoleSelector.tsx          # Role filter component
│   │   ├── SkillsSelector.tsx        # Skills filter component
│   │   └── ui/                       # Shadcn/ui components
│   │       └── button.tsx            # Button component
│   ├── lib/                          # Utility libraries
│   │   └── utils.ts                  # Utility functions
│   ├── public/                       # Static assets
│   │   ├── file.svg                  # File icon
│   │   ├── globe.svg                 # Globe icon
│   │   ├── next.svg                  # Next.js logo
│   │   ├── vercel.svg                # Vercel logo
│   │   └── window.svg                # Window icon
│   ├── package.json                  # Frontend dependencies
│   ├── next.config.ts                # Next.js configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── eslint.config.mjs             # ESLint configuration
│   └── README.md                     # Frontend documentation
│
├── backend/                           # Node.js/Express Backend
│   ├── adapters/                     # External service adapters
│   │   └── openrouterAdapter.ts      # OpenRouter LLM integration
│   ├── controllers/                  # Request controllers
│   │   └── resumeController.ts       # Resume analysis controller
│   ├── mock/                         # Development mocks
│   │   └── togetherMockServer.ts     # Mock LLM server
│   ├── routes/                       # API route definitions
│   │   ├── resume.ts                 # Resume analysis routes
│   │   └── together.ts               # LLM testing routes
│   ├── services/                     # Business logic services
│   │   ├── integrations.ts           # External integrations
│   │   ├── pdfService.ts             # PDF processing service
│   │   └── resumeService.ts          # Resume analysis service
│   ├── types.ts                      # TypeScript type definitions
│   ├── index.ts                      # Main server entry point
│   ├── cli-test.ts                   # CLI testing utility
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend documentation
│
├── agents/                           # AI Agent System (Future)
│   ├── analyzer/                     # Profile analysis agents
│   │   ├── profile-analyzer.ts       # Profile data extractor
│   │   ├── skill-assessment.ts       # Skill evaluation agent
│   │   └── impact-analyzer.ts        # Project impact analyzer
│   ├── matcher/                      # Role matching agents
│   │   ├── role-matcher.ts           # Career role matcher
│   │   ├── job-fit-analyzer.ts       # Job compatibility analyzer
│   │   └── industry-specific.ts      # Industry-specific matcher
│   ├── generator/                    # Content generation agents
│   │   ├── summary-generator.ts      # AI summary creator
│   │   ├── narrative-generator.ts    # Project narrative creator
│   │   └── insight-generator.ts      # Insight generation agent
│   ├── tracker/                      # Learning & growth tracking
│   │   ├── growth-tracker.ts         # Progress monitoring
│   │   ├── learning-analyzer.ts      # Learning pattern analysis
│   │   └── trajectory-predictor.ts   # Career trajectory predictor
│   ├── config/                       # Agent configurations
│   │   ├── agent-config.json         # Global agent settings
│   │   ├── model-configs.json        # LLM model configurations
│   │   └── prompt-templates/         # System prompt templates
│   │       ├── analyzer-prompts.md   # Analysis prompt templates
│   │       ├── matcher-prompts.md    # Matching prompt templates
│   │       ├── generator-prompts.md  # Generation prompt templates
│   │       └── tracker-prompts.md    # Tracking prompt templates
│   ├── communication/                # Inter-agent protocols
│   │   ├── message-protocols.ts      # Agent communication protocol
│   │   ├── data-exchange.ts          # Data sharing mechanisms
│   │   └── coordination.ts           # Agent coordination logic
│   └── learning/                     # Agent learning & adaptation
│       ├── feedback-loop.ts          # User feedback processing
│       ├── performance-metrics.ts    # Agent performance tracking
│       └── adaptation-strategies.ts  # Learning adaptation logic
│
├── data/                             # Structured Data Storage
│   ├── profile/                      # Profile information
│   │   ├── basic-info.json           # Basic profile data
│   │   ├── skills.json               # Technical skills database
│   │   ├── experience.json           # Work experience data
│   │   └── education.json            # Educational background
│   ├── projects/                     # Project information
│   │   ├── github-repos.json         # GitHub repository data
│   │   ├── personal-projects.json    # Personal project details
│   │   ├── contributions.json        # Open source contributions
│   │   └── project-metadata.json     # Project categorization & tags
│   ├── generated/                    # AI-generated content
│   │   ├── role-summaries/           # Role-specific summaries
│   │   │   ├── backend-engineer.json # Backend role summary
│   │   │   ├── frontend-engineer.json# Frontend role summary
│   │   │   ├── security-engineer.json# Security role summary
│   │   │   ├── devops-engineer.json  # DevOps role summary
│   │   │   └── open-source-contributor.json # OSS contributor summary
│   │   ├── project-analyses/         # AI project analyses
│   │   │   ├── [project-id]-analysis.json # Individual project analysis
│   │   │   └── architecture-insights.json # Technical architecture insights
│   │   ├── learning-insights.json    # Growth and learning analysis
│   │   └── career-trajectory.json    # Career development insights
│   └── raw/                          # Raw ingested data
│       ├── github-profile.json       # Raw GitHub profile data
│       ├── github-repos-raw.json     # Raw repository information
│       └── resume-content.json       # Extracted resume content
│
├── kestra/                           # Workflow Orchestration
│   └── workflows/                    # Kestra workflow definitions
│       ├── ingest-github-profile.yml # GitHub data ingestion workflow
│       ├── generate-summaries.yml    # AI summary generation workflow
│       ├── update-skills.yml         # Skills update workflow
│       ├── track-learning.yml        # Learning progress tracking
│       └── scheduled-updates.yml     # Automated update workflows
│
├── scripts/                          # Utility Scripts
│   ├── generate-summaries.ts         # Multi-role summary generator
│   ├── ingest-profile.ts             # Profile data ingestion script
│   ├── github-scraper.ts             # GitHub data scraper utility
│   ├── pdf-processor.ts              # PDF document processor
│   └── data-validator.ts             # Data validation utilities
│
├── .coderabbit.yml                   # CodeRabbit configuration
├── .gitignore                        # Git ignore rules
├── package.json                      # Root package configuration
├── package-lock.json                 # Dependency lock file
├── tsconfig.json                     # TypeScript root configuration
├── vercel.json                       # Vercel deployment configuration
└── README.md                         # This documentation file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **OpenRouter API Key** (free tier available)
- **GitHub Personal Access Token** (optional, for higher API limits)
- **Vercel Account** (for deployment)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd resume-agent
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install && cd ..
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

3. **Environment Configuration**

   **Backend Environment (.env in backend/):**

   ```env
   PORT=3000
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   OPENROUTER_MODEL=mistralai/mistral-7b-instruct
   GITHUB_TOKEN=your_github_personal_access_token
   ```

   **Root Environment (.env in project root):**

   ```env
   GITHUB_USER=your_github_username
   BACKEND_URL=http://localhost:3000
   ```

4. **Start Development Servers**

   ```bash
   # Start backend (Terminal 1)
   cd backend && npm run dev
   
   # Start frontend (Terminal 2)
   cd frontend && npm run dev
   ```

5. **Access the Application**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:3000>
   - Backend Health: <http://localhost:3000/health>

### Data Generation

Generate AI-powered role summaries:

```bash
# Generate summaries for default roles
npm run generate:summaries

# Generate summaries for custom roles
ROLES="frontend-engineer,data-scientist" npm run generate:summaries
```

---

## 📊 API Documentation

### Base URL

```bash
Local Development: http://localhost:3000
Production: https://your-app.vercel.app
```

### Authentication

Most endpoints require an `OPENROUTER_API_KEY` environment variable. For testing purposes, you can provide the API key in the request body or use the mock server for development.

### Endpoints

#### POST /api/resume/analyze

Analyzes resume text or PDF documents and generates AI-powered summaries tailored for specific career roles.

**Request:**

- **Content-Type:** `multipart/form-data` (for PDF) or `application/json` (for text)
- **Body (JSON):**

  ```json
  {
    "text": "Resume text content here...",
    "kind": "backend-engineer" // Optional: role type for tailored analysis
  }
  ```

- **Body (PDF Upload):**
  - Form field: `file` (PDF file, max 10MB)
  - Form field: `kind` (optional role type)

**Response:**

```json
{
  "summary": "AI-generated summary tailored for the specified role...",
  "inputLength": 1250,
  "engine": "openrouter",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "pdfInfo": {
    "pageCount": 2,
    "extractedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Invalid request (missing text/file, invalid PDF)
- `500` - Server error

#### POST /api/llm/test

Tests the LLM integration with custom input and instructions. Useful for development and debugging.

**Request:**

```json
{
  "input": "Text to analyze",
  "instruction": "Summarize this text in 2-3 sentences", // Optional
  "kind": "backend-engineer", // Optional: role context
  "apiKey": "your-api-key", // Optional: override environment key
  "model": "mistralai/mistral-7b-instruct" // Optional: specify model
}
```

**Response:**

```json
{
  "result": "AI-generated response based on input and instruction..."
}
```

#### GET /health

Health check endpoint to verify API availability.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

Common error scenarios:

- Missing or invalid API keys
- Unsupported file types or sizes
- LLM service timeouts
- Invalid request parameters

---

## 🚀 Deployment Guide

### Vercel Deployment

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next` (for frontend) or `dist` (for backend)
     - Install Command: `npm install`

2. **Environment Variables**
   Set the following in Vercel dashboard:

   ```bash
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   OPENROUTER_MODEL=mistralai/mistral-7b-instruct
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_USER=your_github_username
   ```

3. **Frontend Deployment**
   - Deploy from `frontend/` directory
   - Configure domain and SSL
   - Enable preview deployments for PRs

4. **Backend Deployment**
   - Deploy API routes as serverless functions
   - Configure CORS for frontend domain
   - Set up monitoring and logging

### Kestra Workflow Setup

1. **Install Kestra**

   ```bash
   # Using Docker
   docker run --rm -p 8080:8080 kestra/kestra:latest
   ```

2. **Configure Workflows**
   - Import workflow files from `kestra/workflows/`
   - Set up GitHub webhooks for automated triggers
   - Configure data storage connections

3. **Schedule Automated Updates**
   - Set up daily profile data ingestion
   - Configure summary regeneration triggers
   - Monitor workflow execution logs

### Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates enabled
- [ ] Rate limiting implemented
- [ ] Error monitoring set up
- [ ] Backup strategies in place
- [ ] Performance monitoring enabled

---

## 🗺️ Future Roadmap

### Phase 1: Core Agent System (Q1 2024)

- [ ] Implement Profile Analyzer Agent
- [ ] Add Role Matcher Agent with basic role templates
- [ ] Create Content Generator Agent for summaries
- [ ] Set up inter-agent communication protocols

### Phase 2: Advanced Intelligence (Q2 2024)

- [ ] Learning Tracker Agent for growth analysis
- [ ] Oumi integration for model ranking and optimization
- [ ] Advanced conversation memory and context
- [ ] Multi-language support for global users

### Phase 3: Ecosystem Integration (Q3 2024)

- [ ] CodeRabbit integration for automated code reviews
- [ ] Cline integration for autonomous development
- [ ] Advanced Kestra workflows for complex data pipelines
- [ ] Real-time collaboration features

### Phase 4: Enterprise Features (Q4 2024)

- [ ] Team portfolio management
- [ ] Advanced analytics dashboard
- [ ] Custom agent training capabilities
- [ ] API marketplace for third-party integrations

### Long-term Vision

- **Autonomous Career Development**: Agents that proactively suggest improvements
- **Industry-Specific Intelligence**: Specialized agents for different sectors
- **Global Talent Network**: Cross-platform profile aggregation
- **AI-Powered Mentorship**: Intelligent matching with mentors and opportunities

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for consistent formatting
- Comprehensive test coverage

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **WeMakeDevs** for the AI AGENTS ASSEMBLE hackathon
- **OpenRouter** for LLM infrastructure
- **Kestra** for workflow orchestration
- **Vercel** for seamless deployment
- **Oumi** for AI model evaluation
- **CodeRabbit** for automated code reviews
- **Cline** for autonomous development tools
