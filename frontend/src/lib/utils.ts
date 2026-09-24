import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export interface SongCollaborationItem {
  role?: 'CO_ARTIST' | 'FEATURED' | string;
  status?: 'ACCEPTED' | 'PENDING' | 'DECLINED' | string;
  collaborator?: {
    id: string;
    name: string;
    imageKey?: string | null;
  };
}

export function formatSongArtists(
  primaryArtistName?: string,
  collaborations?: SongCollaborationItem[],
): string {
  const primary = primaryArtistName?.trim() || '';
  const accepted = (collaborations || []).filter(
    (c) => c.status === 'ACCEPTED' && c.collaborator?.name,
  );

  const coArtists = accepted
    .map((c) => c.collaborator!.name.trim())
    .filter(Boolean);

  const allArtists = [primary, ...coArtists].filter(Boolean);
  return Array.from(new Set(allArtists)).join(', ');
}
