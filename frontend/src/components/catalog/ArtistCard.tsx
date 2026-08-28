'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';

interface Artist {
  id: string;
  name: string;
  imageKey?: string;
  monthlyListeners?: number;
  isVerified?: boolean;
}

interface ArtistCardProps {
  artist: Artist;
  className?: string;
}

export function ArtistCard({ artist, className }: ArtistCardProps) {
  const photo = artworkUrl(artist.imageKey);

  return (
    <Link
      href={`/artist/${artist.id}`}
      className={cn(
        'group flex flex-col items-center text-center p-4 rounded bg-surface border-2 border-prussian-blue',
        'hover:-translate-y-1 transition-transform hard-shadow shadow-prussian-blue select-none',
        className
      )}
    >
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3 border-2 border-prussian-blue group-hover:border-vibrant-saffron transition-colors bg-midnight-blue">
        <ArtworkImage
          src={photo}
          alt={artist.name}
          type="artist"
          id={artist.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="font-label-md text-sm font-bold text-prussian-blue truncate w-full group-hover:text-vibrant-saffron transition-colors">
        {artist.name}
      </p>
      <p className="font-caption text-xs text-outline mt-0.5">Artist</p>
    </Link>
  );
}
