'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  ListPlus,
  ListMusic,
  Heart,
  Disc,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { usePlayerStore, type Song } from '@/stores/player.store';
import { useLibraryStore } from '@/stores/library.store';
import { toast } from '@/stores/toast.store';

interface TrackOptionsMenuProps {
  song: Song;
  className?: string;
  align?: 'left' | 'right';
}

export function TrackOptionsMenu({
  song,
  className = '',
  align = 'right',
}: TrackOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const playNext = usePlayerStore((s) => s.playNext);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const isSongLiked = useLibraryStore((s) => s.isSongLiked);
  const toggleLikeSong = useLibraryStore((s) => s.toggleLikeSong);

  const liked = isSongLiked(song.id);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/song/${song.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1000);
    } catch {
      toast.error('Failed to copy link');
      setIsOpen(false);
    }
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label="Track options"
        aria-expanded={isOpen}
        className={`p-1.5 rounded text-on-surface-muted hover:text-prussian-blue transition-colors cursor-pointer focus:outline-none ${className}`}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1 w-48 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 border border-prussian-blue/15`}
          style={{
            background: '#18223C',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Play Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playNext(song);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            <ListPlus className="w-4 h-4 text-vibrant-saffron flex-shrink-0" />
            Play Next
          </button>

          {/* Add to Queue */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToQueue(song);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            <ListMusic className="w-4 h-4 text-crisp-green flex-shrink-0" />
            Add to Queue
          </button>

          <div className="my-1 border-t border-white/10" />

          {/* Like / Unlike */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeSong(song);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            <Heart
              className={`w-4 h-4 flex-shrink-0 ${
                liked ? 'fill-current text-vibrant-saffron' : 'text-slate-400'
              }`}
            />
            {liked ? 'Remove from Liked' : 'Save to Liked Songs'}
          </button>

          {/* Go to Album */}
          {song.album?.id && (
            <Link
              href={`/album/${song.album.id}`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
            >
              <Disc className="w-4 h-4 text-slate-400 flex-shrink-0" />
              Go to Album
            </Link>
          )}

          {/* Go to Artist */}
          {song.album?.artist?.id && (
            <Link
              href={`/artist/${song.album.artist.id}`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              Go to Artist
            </Link>
          )}

          <div className="my-1 border-t border-white/10" />

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left"
          >
            {copied ? (
              <Check className="w-4 h-4 text-crisp-green flex-shrink-0" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
            {copied ? 'Copied!' : 'Copy Song Link'}
          </button>
        </div>
      )}
    </div>
  );
}
