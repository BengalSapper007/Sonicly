import { Global, Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { R2MediaProvider } from './providers/r2-media.provider';

/**
 * Global MediaModule — registers R2MediaProvider and MediaService so that
 * any module can inject MediaService without re-importing this module.
 *
 * MediaController provides GET /api/media/artwork?key= for artwork delivery.
 */
@Global()
@Module({
  controllers: [MediaController],
  providers: [R2MediaProvider, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
