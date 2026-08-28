'use client';
import { useState } from 'react';
import { Music, Disc, User as UserIcon, ListMusic } from 'lucide-react';

interface ArtworkImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  type?: 'album' | 'artist' | 'playlist' | 'song';
  id?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

const GRADIENTS = [
  'linear-gradient(135deg, #003153 0%, #ff8800 100%)',
  'linear-gradient(135deg, #001D34 0%, #1B6D24 100%)',
  'linear-gradient(135deg, #ff8800 0%, #cc6d00 100%)',
  'linear-gradient(135deg, #003153 0%, #001D34 100%)',
  'linear-gradient(135deg, #1B6D24 0%, #003153 100%)',
  'linear-gradient(135deg, #ff8800 0%, #001D34 100%)',
];

function getGradient(str: string = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function ArtworkImage({
  src,
  alt,
  className = '',
  type = 'album',
  id = '',
  size = 'md',
}: ArtworkImageProps) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src || hasError;

  if (showFallback) {
    const gradient = getGradient(id || alt);
    const initial = alt?.trim() ? alt.trim()[0].toUpperCase() : 'S';

    const Icon =
      type === 'artist'
        ? UserIcon
        : type === 'playlist'
        ? ListMusic
        : type === 'song'
        ? Music
        : Disc;

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center select-none relative overflow-hidden ${className}`}
        style={{
          background: gradient,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />

        {size === 'hero' ? (
          <div className="flex flex-col items-center gap-3 z-10">
            <Icon className="w-16 h-16 text-white/80" />
            <span className="text-4xl font-black text-white drop-shadow-md">
              {alt}
            </span>
          </div>
        ) : size === 'lg' ? (
          <div className="flex flex-col items-center gap-2 z-10">
            <span className="text-3xl font-black text-white drop-shadow-md">
              {initial}
            </span>
            <Icon className="w-6 h-6 text-white/70" />
          </div>
        ) : size === 'sm' ? (
          <Icon className="w-4 h-4 text-white/90 z-10" />
        ) : (
          <div className="flex flex-col items-center gap-1 z-10">
            <span className="text-2xl font-black text-white drop-shadow-md">
              {initial}
            </span>
            <Icon className="w-5 h-5 text-white/80" />
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
