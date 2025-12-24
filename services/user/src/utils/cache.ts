import { redisClient } from "../index.js";

/**
 * Cache utility functions for Redis operations
 */
export class CacheService {
  /**
   * Set a cache entry with expiration
   */
  static async set(
    key: string,
    value: any,
    ttlSeconds: number = 1800
  ): Promise<void> {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  }

  /**
   * Get a cache entry
   */
  static async get<T>(key: string): Promise<T | null> {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Delete a cache entry
   */
  static async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  /**
   * Delete multiple cache entries by pattern
   */
  static async delPattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }

  /**
   * Invalidate user profile cache
   */
  static async invalidateUserProfile(userId: string): Promise<void> {
    await this.del(`user:profile:${userId}`);
  }

  /**
   * Invalidate all user caches for a specific user
   */
  static async invalidateUserCaches(userId: string): Promise<void> {
    await this.delPattern(`user:*:${userId}`);
  }
}

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  USER_PROFILE: 30 * 60, // 30 minutes
  USER_APPLICATIONS: 15 * 60, // 15 minutes
  USER_SKILLS: 60 * 60, // 1 hour
} as const;
