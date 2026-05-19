import Redis from "ioredis";

import { env } from "./env.js";

let redisClient: Redis | undefined;

export function getRedis(): Redis {
  if (!redisClient) {
    const client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: () => null
    });
    // Suppress connection errors — app runs in degraded mode without Redis
    client.on("error", () => {});
    redisClient = client;
  }
  return redisClient;
}

export async function connectRedis(): Promise<Redis | null> {
  try {
    const client = getRedis();
    if (client.status === "wait") {
      await client.connect();
    }
    return client;
  } catch {
    return null;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient && redisClient.status !== "end") {
      await redisClient.quit();
    }
  } catch {
    // ignore
  }
}
