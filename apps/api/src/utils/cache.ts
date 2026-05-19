/**
 * Redis caching utility for frequently accessed data.
 * Provides TTL-based caching for database queries.
 */
import { getRedis } from "../config/redis.js";

const DEFAULT_TTL_SEC = 300; // 5 minutes
const CACHE_PREFIX = "cache:";

export function cacheKey(prefix: string, key: string): string {
  return `${CACHE_PREFIX}${prefix}:${key}`;
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    if (redis.status !== "ready") return null;
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttlSec = DEFAULT_TTL_SEC): Promise<void> {
  try {
    const redis = getRedis();
    if (redis.status !== "ready") return;
    await redis.setex(key, ttlSec, JSON.stringify(value));
  } catch {
    // Cache set failure is non-critical
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    if (redis.status !== "ready") return;
    const keys = await redis.keys(`${CACHE_PREFIX}${pattern}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Cache invalidation failure is non-critical
  }
}

// Specific cache helpers

export const CacheKeys = {
  modules: () => cacheKey("modules", "all"),
  moduleById: (id: string) => cacheKey("modules", id),
  questionsByModule: (moduleId: string, level: string) =>
    cacheKey("questions", `${moduleId}:${level}`),
  schoolById: (id: string) => cacheKey("schools", id),
  proudMoments: () => cacheKey("heart", "proud-moments"),
  moodTrend: (userId: string) => cacheKey("heart", `mood:${userId}`),
  volunteerStats: (userId: string) => cacheKey("volunteer", `stats:${userId}`),
} as const;
