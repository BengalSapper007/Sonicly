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
        'group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/5',
        'hover:border-white/10 hover:bg-zinc-900/90 transition-all duration-200 hover:-translate-y-1 shadow-lg',
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        <ArtworkImage
          src={cover}
          alt={playlist.name}
          type="playlist"
          id={playlist.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div
            className="w-11 h-11 rounded-full bg-cyan-400 text-cyan-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            style={{ boxShadow: '0 0 20px rgba(76, 215, 246, 0.6)' }}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors">
          {playlist.name}
        </p>
        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">
          {playlist.description ||
            `${playlist._count?.songs ?? playlist.songs?.length ?? 0} songs`}
        </p>
      </div>
    </Link>
  );
}
