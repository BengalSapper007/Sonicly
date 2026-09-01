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
        'group flex flex-col items-center text-center p-4 surface-card',
        className
      )}
    >
      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 group-hover:ring-2 group-hover:ring-vibrant-saffron transition-all">
        <ArtworkImage
          src={photo}
          alt={artist.name}
          type="artist"
          id={artist.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className="text-sm font-semibold text-on-surface truncate w-full group-hover:text-vibrant-saffron transition-colors">
        {artist.name}
      </p>
      <p className="text-xs text-on-surface-muted mt-0.5">
        {artist.isVerified ? 'Verified artist' : 'Artist'}
      </p>
    </Link>
  );
}
