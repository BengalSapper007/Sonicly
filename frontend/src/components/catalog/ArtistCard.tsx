'use client';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';
import { gradientFromId } from '@/lib/gradient';

interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  monthlyListeners?: number;
  isVerified?: boolean;
  _count?: { followers: number };
}

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group flex-shrink-0 w-36 flex flex-col items-center p-4 rounded-xl
        bg-surface border border-rim/50 hover:border-rim hover:bg-elevated
        transition-all duration-200 cursor-pointer hover:-translate-y-0.5 shadow-card"
    >
      {/* Avatar */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-rim group-hover:ring-sonic/30 transition-all">
        {artist.imageUrl && !artist.imageUrl.startsWith('/') ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: gradientFromId(artist.id) }}
          >
            <span className="text-white text-2xl font-bold">
              {artist.name[0]?.toUpperCase()}
            </span>
          </div>
        )}
        {artist.isVerified && (
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-sonic rounded-full border-2 border-surface
            flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-ink text-center line-clamp-1 group-hover:text-sonic transition-colors">
        {artist.name}
      </p>

      {/* Listeners */}
      {artist.monthlyListeners && (
        <p className="text-xs text-ink-ghost mt-0.5 text-center">
          {formatNumber(artist.monthlyListeners)} listeners
        </p>
      )}
    </Link>
  );
}
