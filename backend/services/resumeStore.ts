// backend/services/resumeStore.ts
import { getRedis, isUsingRedis } from "./redisClient";

const PREFIX = "resume:";

// in-memory fallback (dev only)
const memoryStore = new Map<string, string>();

export async function saveResume(resume_id: string, text: string): Promise<void> {
  if (isUsingRedis()) {
    const r = getRedis();
    if (!r) throw new Error("Redis client not initialized");
    await r.set(`${PREFIX}${resume_id}`, text);
    return;
  }
  memoryStore.set(resume_id, text);
}

export async function getResume(resume_id: string): Promise<string | undefined> {
  if (isUsingRedis()) {
    const r = getRedis();
    if (!r) throw new Error("Redis client not initialized");
    const result = await r.get(`${PREFIX}${resume_id}`);
    return result ? String(result) : undefined;
  }
  return memoryStore.get(resume_id);
}

export async function deleteResume(resume_id: string): Promise<void> {
  if (isUsingRedis()) {
    const r = getRedis();
    if (!r) throw new Error("Redis client not initialized");
    await r.del(`${PREFIX}${resume_id}`);
    return;
  }
  memoryStore.delete(resume_id);
}
