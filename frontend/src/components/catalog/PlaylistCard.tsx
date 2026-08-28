'use client';
import Link from 'next/link';
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
        'group relative flex flex-col rounded bg-surface border-t-4 border-t-vibrant-saffron border-x-2 border-b-2 border-prussian-blue p-3.5',
        'hover:-translate-y-1 transition-transform hard-shadow shadow-prussian-blue select-none',
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden mb-3 border border-prussian-blue bg-surface-variant">
        <ArtworkImage
          src={cover}
          alt={playlist.name}
          type="playlist"
          id={playlist.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-prussian-blue/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-vibrant-saffron text-prussian-blue border-2 border-prussian-blue flex items-center justify-center shadow-md group-hover:scale-110 transition-transform font-bold">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </div>
        </div>
      </div>

      <div>
        <p className="font-label-md text-sm font-bold text-prussian-blue truncate group-hover:text-vibrant-saffron transition-colors">
          {playlist.name}
        </p>
        <p className="font-caption text-xs text-outline mt-0.5 line-clamp-2">
          {playlist.description ||
            `${playlist._count?.songs ?? playlist.songs?.length ?? 0} tracks`}
        </p>
      </div>
    </Link>
  );
}
