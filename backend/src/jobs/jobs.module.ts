import { Global, Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CatalogProcessor } from './processors/catalog.processor';
import { AnalyticsProcessor } from './processors/analytics.processor';

@Global()
@Module({
  providers: [CatalogProcessor, AnalyticsProcessor, JobsService],
  exports: [JobsService],
})
export class JobsModule {}
