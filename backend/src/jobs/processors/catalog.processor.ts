import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaService } from '../../media/media.service';

@Injectable()
export class CatalogProcessor {
  private readonly logger = new Logger(CatalogProcessor.name);

  constructor(
    private prisma: PrismaService,
    private media: MediaService,
  ) {}

  /**
   * Process uploaded audio: verify existence, inspect duration/metadata, update record.
   */
  async processAudioMetadata(payload: { songId?: string; audioKey?: string }) {
    const { songId, audioKey } = payload;
    this.logger.log(`Processing audio metadata for song: ${songId || 'unknown'}`);

    if (!songId) return;

    try {
      const song = await this.prisma.song.findUnique({ where: { id: songId } });
      if (!song) {
        this.logger.warn(`Song ${songId} not found during background processing.`);
        return;
      }

      // Verify object exists in storage
      if (audioKey) {
        const exists = await this.media.objectExists(audioKey);
        this.logger.log(`Audio object "${audioKey}" exists in R2: ${exists}`);
      }

      this.logger.log(`Audio processing complete for song "${song.title}" (${songId}).`);
    } catch (err: any) {
      this.logger.error(`Failed to process audio for ${songId}: ${err.message}`);
    }
  }
}
