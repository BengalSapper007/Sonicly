'use client';
import Link from 'next/link';
import { PlayIcon, ListMusicIcon } from 'lucide-react';
import { gradientFromId } from '@/lib/gradient';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  _count?: { songs: number };
}

interface PlaylistCardProps {
  playlist: Playlist;
  size?: 'sm' | 'md';
}

export function PlaylistCard({ playlist, size = 'md' }: PlaylistCardProps) {
  const w = size === 'sm' ? 'w-36' : 'w-44';

  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className={`group flex-shrink-0 ${w} flex flex-col rounded-xl overflow-hidden
        bg-surface border border-rim/50 hover:border-rim hover:bg-elevated
        transition-all duration-200 hover:-translate-y-0.5 shadow-card cursor-pointer`}
    >
      {/* Cover */}
      <div className="relative aspect-square overflow-hidden">
        {playlist.imageUrl && !playlist.imageUrl.startsWith('/') ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: gradientFromId(playlist.id) }}
          >
            <ListMusicIcon size={32} className="text-white/50" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-void/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-sonic shadow-sonic flex items-center justify-center
            translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <PlayIcon size={18} className="text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-ink line-clamp-1 group-hover:text-sonic transition-colors">
          {playlist.name}
        </p>
        {playlist.description && (
          <p className="text-xs text-ink-dim mt-0.5 line-clamp-2">{playlist.description}</p>
        )}
        {playlist._count?.songs !== undefined && (
          <p className="text-xs text-ink-ghost mt-1">{playlist._count.songs} songs</p>
        )}
      </div>
    </Link>
  );
}
