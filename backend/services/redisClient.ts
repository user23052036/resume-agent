import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;
let usingRedis = false;

export async function initRedis(): Promise<void> {
  const nodeEnv = process.env.NODE_ENV || "development";
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    if (nodeEnv === "production") {
      throw new Error("REDIS_URL is required in production");
    }
    console.warn("[REDIS] REDIS_URL missing — Redis required for resume storage");
    usingRedis = false;
    return;
  }

  try {
    const isTLS = redisUrl.startsWith("rediss://");

    redisClient = createClient({
      url: redisUrl,
      socket: isTLS
        ? {
            tls: true,
            rejectUnauthorized: true,
            connectTimeout: 10000,
          }
        : {
            connectTimeout: 10000,
          },
    });


    await redisClient.connect();
    usingRedis = true;
    console.log("[REDIS] connected");
  } catch (err) {
    if (nodeEnv === "production") {
      throw err;
    }
    console.warn("[REDIS] connection failed — Redis required for resume storage");
    usingRedis = false;
    redisClient = null;
  }
}

export function getRedis(): RedisClientType {
  if (!redisClient) {
    throw new Error("Redis client requested but not initialized");
  }
  return redisClient;
}

export function isUsingRedis(): boolean {
  return usingRedis;
}
