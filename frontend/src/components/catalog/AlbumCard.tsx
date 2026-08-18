'use client';
import Link from 'next/link';
import { PlayIcon } from 'lucide-react';
import { usePlayerStore } from '@/stores/player.store';
import { cn } from '@/lib/utils';
import { gradientFromId } from '@/lib/gradient';

interface Album {
  id: string;
  title: string;
  imageUrl?: string;
  releaseYear?: number;
  albumType?: string;
  artist?: { id: string; name: string };
  _count?: { songs: number };
}

interface AlbumCardProps {
  album: Album;
  className?: string;
}

export function AlbumCard({ album, className }: AlbumCardProps) {
  const { playSong } = usePlayerStore();

  return (
    <Link
      href={`/album/${album.id}`}
      className={cn(
        'group relative flex flex-col rounded-xl overflow-hidden bg-surface border border-rim/50',
        'hover:border-rim hover:bg-elevated transition-all duration-200 hover:-translate-y-0.5',
        'shadow-card hover:shadow-elevated cursor-pointer',
        className
      )}
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden bg-elevated">
        {album.imageUrl && !album.imageUrl.startsWith('/') ? (
          <img
            src={album.imageUrl}
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: gradientFromId(album.id) }}
          >
            <span className="text-white text-3xl opacity-40 font-bold">
              {album.title[0]?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-void/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-sonic shadow-sonic flex items-center justify-center
            translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <PlayIcon size={18} className="text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-ink line-clamp-1 group-hover:text-sonic transition-colors">
          {album.title}
        </p>
        {album.artist && (
          <p className="text-xs text-ink-dim mt-0.5 line-clamp-1">{album.artist.name}</p>
        )}
        <div className="flex items-center gap-1 mt-1">
          {album.releaseYear && (
            <span className="text-xs text-ink-ghost">{album.releaseYear}</span>
          )}
          {album.albumType && (
            <span className="text-xs text-ink-ghost capitalize">· {album.albumType.toLowerCase()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
