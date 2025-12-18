// backend/services/resumeStore.ts
import { getRedis, isUsingRedis } from "./redisClient";

const PREFIX = "resume:";

// In-memory fallback for local development only
const memoryStore = new Map<string, string>();

export async function saveResume(resume_id: string, text: string): Promise<void> {
  if (isUsingRedis()) {
    try {
      const r = getRedis();
      if (!r) throw new Error("Redis client not initialized");
      await r.set(`${PREFIX}${resume_id}`, text, { EX: 1800 });
    } catch (err) {
      console.error("Failed to save resume to Redis:", err);
      throw err; // Propagate error to be handled by controller
    }
  } else {
    // Dev fallback
    memoryStore.set(resume_id, text);
  }
}

export async function getResume(resume_id: string): Promise<string | undefined> {
  if (isUsingRedis()) {
    try {
      const r = getRedis();
      if (!r) {
        console.error("Redis client not initialized on getResume");
        return undefined;
      }
      const result = await r.get(`${PREFIX}${resume_id}`);
      return result ? String(result) : undefined;
    } catch (err) {
      console.error("Failed to get resume from Redis:", err);
      return undefined;
    }
  }
  // Dev fallback
  return memoryStore.get(resume_id);
}

export async function deleteResume(resume_id: string): Promise<void> {
  if (isUsingRedis()) {
    const r = getRedis();
    if (!r) throw new Error("Redis client not initialized");
    await r.del(`${PREFIX}${resume_id}`);
    return;
  }
  // Dev fallback
  memoryStore.delete(resume_id);
}
