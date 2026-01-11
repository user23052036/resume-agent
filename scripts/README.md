# Scripts Documentation

This directory contains utility scripts for AI Resume & Portfolio Agent.

## test-agent.ts

Tests the AI agent functionality with sample resume data and validates response quality.

### Usage

```bash
npm run test:agent
```

### Environment Variables

- `OPENROUTER_API_KEY` (required): OpenRouter API key for LLM access
- `BACKEND_URL` (optional): Backend API URL (defaults to `http://localhost:3000`)

### Example Output

The script validates agent responses and provides feedback on response quality and relevance.

## Note: GitHub Integration Removed

The GitHub integration scripts (`generate-summaries.ts` and related functionality) have been removed from this codebase as the feature has been fully abandoned. The system now operates exclusively on resume PDF uploads.

## Common Environment Setup

Create a `.env` file in project root:

```env
OPENROUTER_API_KEY=your-openrouter-api-key
BACKEND_URL=http://localhost:3000
```

## Available Scripts

- `npm run test:agent` - Test AI agent functionality
- `npm run dev` - Start backend development server
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
