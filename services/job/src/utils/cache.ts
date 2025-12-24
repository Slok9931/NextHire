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
   * Invalidate all job-related caches
   */
  static async invalidateJobCaches(): Promise<void> {
    await Promise.all([
      this.del("jobs:all"),
      this.del("roles:all"),
      this.delPattern("job:details:*"),
      this.delPattern("jobs:filtered:*"),
    ]);
  }

  /**
   * Invalidate company-related caches
   */
  static async invalidateCompanyCaches(): Promise<void> {
    await Promise.all([
      this.del("companies:all"),
      this.delPattern("companies:recruiter:*"),
      this.delPattern("company:details:*"),
    ]);
  }

  /**
   * Invalidate specific company cache
   */
  static async invalidateCompanyCache(
    companyId: string,
    recruiterId?: string
  ): Promise<void> {
    const promises = [
      this.del("companies:all"),
      this.del(`company:details:${companyId}`),
    ];

    if (recruiterId) {
      promises.push(this.del(`companies:recruiter:${recruiterId}`));
    }

    await Promise.all(promises);
  }
}

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  COMPANIES: 60 * 60, // 1 hour
  COMPANY_DETAILS: 30 * 60, // 30 minutes
  JOBS: 15 * 60, // 15 minutes
  JOB_DETAILS: 30 * 60, // 30 minutes
  ROLES: 2 * 60 * 60, // 2 hours
  USER_COMPANIES: 30 * 60, // 30 minutes
} as const;
