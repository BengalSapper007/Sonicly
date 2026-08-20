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
        'group flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-900/40 border border-white/5',
        'hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-200 hover:-translate-y-1 shadow-lg',
        className
      )}
    >
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3 shadow-md ring-2 ring-transparent group-hover:ring-purple-400/50 transition-all">
        <ArtworkImage
          src={photo}
          alt={artist.name}
          type="artist"
          id={artist.id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className="text-sm font-semibold text-zinc-100 truncate w-full group-hover:text-purple-300 transition-colors">
        {artist.name}
      </p>
      <p className="text-xs text-zinc-400 mt-0.5">Artist</p>
    </Link>
  );
}
