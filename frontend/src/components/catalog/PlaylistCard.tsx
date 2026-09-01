'use client';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageKey?: string;
  coverUrl?: string;
  _count?: { songs: number };
  songs?: any[];
}

interface PlaylistCardProps {
  playlist: Playlist;
  className?: string;
}

export function PlaylistCard({ playlist, className }: PlaylistCardProps) {
  const cover = playlist.coverUrl || artworkUrl(playlist.imageKey);

  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className={cn(
        'group relative flex flex-col surface-card overflow-hidden',
        'border-l-2 border-l-crisp-green',
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-surface-raised">
        <ArtworkImage
          src={cover}
          alt={playlist.name}
          type="playlist"
          id={playlist.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-prussian-blue/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-crisp-green text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold text-on-surface truncate group-hover:text-crisp-green transition-colors">
          {playlist.name}
        </p>
        <p className="text-xs text-on-surface-muted mt-0.5 line-clamp-2">
          {playlist.description ||
            `${playlist._count?.songs ?? playlist.songs?.length ?? 0} songs`}
        </p>
      </div>
    </Link>
  );
}
