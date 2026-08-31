import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { SongsModule } from './songs/songs.module';
import { GenresModule } from './genres/genres.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { LibraryModule } from './library/library.module';
import { HistoryModule } from './history/history.module';
import { SearchModule } from './search/search.module';
import { AdminCatalogModule } from './admin-catalog/admin-catalog.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // IP rate limiting — default: 60 req / 60 s per IP
    // Auth & search controllers override this with stricter @Throttle() decorators
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    MediaModule,        // Global — MediaService available everywhere
    AuthModule,
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    SongsModule,
    GenresModule,
    PlaylistsModule,
    LibraryModule,
    HistoryModule,
    SearchModule,
    AdminCatalogModule,
  ],
  providers: [
    // IP rate limiting guard (runs before JWT so brute-force is blocked early)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Apply JWT guard globally — use @Public() to opt out
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Apply global exception filter
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
