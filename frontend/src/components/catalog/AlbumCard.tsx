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
        'group relative flex flex-col surface-card overflow-hidden',
        className
      )}
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden bg-surface-raised">
        <ArtworkImage
          src={cover}
          alt={album.title}
          type="album"
          id={album.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-prussian-blue/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-vibrant-saffron text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-on-surface truncate group-hover:text-vibrant-saffron transition-colors">
          {album.title}
        </p>
        {album.artist && (
          <p className="text-xs text-on-surface-muted truncate mt-0.5">{album.artist.name}</p>
        )}
        <div className="flex items-center gap-1 mt-1 text-[11px] text-on-surface-muted">
          {album.releaseYear && <span>{album.releaseYear}</span>}
          {album.albumType && (
            <span className="capitalize">{album.releaseYear ? ', ' : ''}{album.albumType.toLowerCase()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
