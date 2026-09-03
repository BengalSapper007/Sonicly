import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import Redis from 'ioredis';

@Injectable()
export class AppCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppCacheService.name);
  private redisClient: Redis | null = null;
  private isRedisReady = false;

  constructor(@Inject(CACHE_MANAGER) private memoryCache: Cache) {}

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    try {
      const client = new Redis(redisUrl, {
        lazyConnect: true,
        connectTimeout: 1500,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null, // Do not spam retries if Redis is down
      });

      // Quick probe with timeout
      await Promise.race([
        client.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Redis connection timed out (1500ms)')), 1500)
        ),
      ]);

      this.redisClient = client;
      this.isRedisReady = true;
      this.logger.log(`Connected to Redis at ${redisUrl} for distributed caching.`);

      client.on('error', (err) => {
        if (this.isRedisReady) {
          this.logger.warn(`Redis disconnected: ${err.message}. Falling back to memory cache.`);
          this.isRedisReady = false;
        }
      });

      client.on('ready', () => {
        this.isRedisReady = true;
      });
    } catch {
      this.isRedisReady = false;
      this.logger.log('Redis is offline or not configured. Using high-performance in-memory cache.');
    }
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      try {
        await this.redisClient.quit();
      } catch {
        // Ignore shutdown errors
      }
    }
  }

  get isRedisActive(): boolean {
    return this.isRedisReady && this.redisClient !== null;
  }

  /**
   * Get cached value by key.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isRedisActive) {
        const raw = await this.redisClient!.get(key);
        return raw ? JSON.parse(raw) : null;
      }
      const val = await this.memoryCache.get<T>(key);
      return val ?? null;
    } catch (err: any) {
      this.logger.debug(`Cache get error for key "${key}": ${err.message}`);
      return null;
    }
  }

  /**
   * Set cached value with TTL in seconds (default: 60s).
   */
  async set(key: string, value: any, ttlSeconds = 60): Promise<void> {
    try {
      if (this.isRedisActive) {
        await this.redisClient!.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      }
      // Memory cache TTL in ms
      await this.memoryCache.set(key, value, ttlSeconds * 1000);
    } catch (err: any) {
      this.logger.debug(`Cache set error for key "${key}": ${err.message}`);
    }
  }

  /**
   * Delete specific key from cache.
   */
  async del(key: string): Promise<void> {
    try {
      if (this.isRedisActive) {
        await this.redisClient!.del(key);
        return;
      }
      await this.memoryCache.del(key);
    } catch (err: any) {
      this.logger.debug(`Cache del error for key "${key}": ${err.message}`);
    }
  }

  /**
   * Invalidate all keys matching a prefix pattern (e.g. "search:*", "artists:*").
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      if (this.isRedisActive) {
        const keys = await this.redisClient!.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient!.del(...keys);
        }
        return;
      }
      // In-memory fallback
      await (this.memoryCache as any).reset?.();
    } catch (err: any) {
      this.logger.debug(`Cache delPattern error for pattern "${pattern}": ${err.message}`);
    }
  }

  /**
   * Cache wrapper: returns cached data if exists, otherwise executes fetchFn and caches result.
   */
  async wrap<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds = 60): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const fresh = await fetchFn();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  }
}
