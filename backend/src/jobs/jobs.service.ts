import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AppCacheService } from '../common/cache/app-cache.service';
import { CatalogProcessor } from './processors/catalog.processor';
import { AnalyticsProcessor } from './processors/analytics.processor';

export type JobName =
  | 'process-audio-metadata'
  | 'compute-monthly-listeners'
  | 'compute-top-charts';

export interface JobPayload {
  songId?: string;
  artistId?: string;
  audioKey?: string;
  [key: string]: any;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private queue: Queue | null = null;

  constructor(
    private cache: AppCacheService,
    private catalogProcessor: CatalogProcessor,
    private analyticsProcessor: AnalyticsProcessor,
  ) {
    this.initQueue();
  }

  private initQueue() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      // If Redis is reachable, setup BullMQ queue
      this.queue = new Queue('sonicly-jobs', {
        connection: {
          url: redisUrl,
          maxRetriesPerRequest: null,
          enableOfflineQueue: false,
          retryStrategy: () => null,
        },
      });

      this.queue.on('error', (err) => {
        this.logger.debug(`BullMQ queue event: ${err.message}`);
      });
    } catch {
      this.queue = null;
      this.logger.log('BullMQ running in in-process fallback mode (Redis offline).');
    }
  }

  /**
   * Dispatch a background job.
   * If Redis is active, queues into BullMQ.
   * If Redis is offline, runs asynchronously in-process.
   */
  async dispatch(name: JobName, payload: JobPayload = {}): Promise<{ queued: boolean; mode: 'bullmq' | 'in-process' }> {
    if (this.cache.isRedisActive && this.queue) {
      try {
        await this.queue.add(name, payload, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
          removeOnFail: 100,
        });
        this.logger.log(`[BullMQ] Enqueued job "${name}" for background worker.`);
        return { queued: true, mode: 'bullmq' };
      } catch (err: any) {
        this.logger.warn(`BullMQ add failed: ${err.message}. Falling back to in-process execution.`);
      }
    }

    // In-process resilient execution
    this.logger.log(`[In-Process Worker] Executing job "${name}" asynchronously.`);
    setImmediate(async () => {
      try {
        await this.executeInProcess(name, payload);
      } catch (err: any) {
        this.logger.error(`In-process job "${name}" failed: ${err.message}`, err.stack);
      }
    });

    return { queued: true, mode: 'in-process' };
  }

  private async executeInProcess(name: JobName, payload: JobPayload) {
    switch (name) {
      case 'process-audio-metadata':
        return this.catalogProcessor.processAudioMetadata(payload);
      case 'compute-monthly-listeners':
        return this.analyticsProcessor.computeMonthlyListeners(payload);
      case 'compute-top-charts':
        return this.analyticsProcessor.computeTopCharts();
      default:
        this.logger.warn(`Unknown job name: ${name}`);
    }
  }
}
