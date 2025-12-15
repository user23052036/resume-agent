// backend/services/resumeStore.ts
/**
 * Global in-memory resume storage for Vercel serverless compatibility.
 * Stores resume text by resume_id for chat context retrieval.
 */

const resumeStore = new Map<string, string>();

export function saveResume(resume_id: string, text: string): void {
  resumeStore.set(resume_id, text);
}

export function getResume(resume_id: string): string | undefined {
  return resumeStore.get(resume_id);
}
