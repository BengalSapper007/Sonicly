import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppCacheService } from './app-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 60_000, // default 60s
      max: 1000,   // max 1000 items in in-memory store
      isGlobal: true,
    }),
  ],
  providers: [AppCacheService],
  exports: [AppCacheService, CacheModule],
})
export class AppCacheModule {}
