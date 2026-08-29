'use client';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';

interface Album {
  id: string;
  title: string;
  imageKey?: string;
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
  const cover = artworkUrl(album.imageKey);

  return (
    <Link
      href={`/album/${album.id}`}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/5',
        'hover:border-white/10 hover:bg-zinc-900/90 transition-all duration-200 hover:-translate-y-1 shadow-lg',
        className
      )}
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        <ArtworkImage
          src={cover}
          alt={album.title}
          type="album"
          id={album.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div
            className="w-11 h-11 rounded-full bg-cyan-400 text-cyan-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            style={{ boxShadow: '0 0 20px rgba(76, 215, 246, 0.6)' }}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors">
          {album.title}
        </p>
        {album.artist && (
          <p className="text-xs text-zinc-400 mt-0.5 truncate">{album.artist.name}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400">
          {album.releaseYear && <span>{album.releaseYear}</span>}
          {album.albumType && (
            <span className="capitalize">· {album.albumType.toLowerCase()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
