'use client';
import Link from 'next/link';
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
        'group relative flex flex-col rounded bg-surface border-2 border-prussian-blue p-3.5',
        'hover:-translate-y-1 transition-transform hard-shadow shadow-prussian-blue select-none',
        className
      )}
    >
      {/* Cover art */}
      <div className="relative aspect-square overflow-hidden mb-3 border border-prussian-blue bg-surface-variant">
        <ArtworkImage
          src={cover}
          alt={album.title}
          type="album"
          id={album.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-prussian-blue/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-vibrant-saffron text-prussian-blue border-2 border-prussian-blue flex items-center justify-center shadow-md group-hover:scale-110 transition-transform font-bold">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="font-label-md text-sm font-bold text-prussian-blue truncate group-hover:text-vibrant-saffron transition-colors">
          {album.title}
        </p>
        {album.artist && (
          <p className="font-caption text-xs text-outline mt-0.5 truncate">{album.artist.name}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1 font-caption text-[11px] text-outline">
          {album.releaseYear && <span>{album.releaseYear}</span>}
          {album.albumType && (
            <span className="capitalize">· {album.albumType.toLowerCase()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
