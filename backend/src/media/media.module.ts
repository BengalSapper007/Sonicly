import { Global, Module } from '@nestjs/common';
import { MediaService } from './media.service';

/**
 * Global MediaModule — exported so any module can inject MediaService
 * without re-importing it. This mirrors how PrismaModule works.
 */
@Global()
@Module({
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
