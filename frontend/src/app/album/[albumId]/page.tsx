'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { PlayIcon, ShuffleIcon, HeartIcon } from 'lucide-react';
import { albumsApi } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDuration } from '@/lib/utils';
import type { Metadata } from 'next';

export default function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayerStore();

  useEffect(() => {
    albumsApi.get(albumId)
      .then(r => setAlbum(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [albumId]);

  if (loading) return <AlbumSkeleton />;
  if (!album) return <NotFound />;

  const songs = album.songs || [];
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);

  const handlePlayAll = () => playQueue(songs, 0, 'album', album.id);
  const handleShuffle = () => {
    const idx = Math.floor(Math.random() * songs.length);
    playQueue(songs, idx, 'album', album.id);
  };

  return (
    <div className="min-h-full pb-8">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Blurred background */}
        <div className="absolute inset-0 overflow-hidden">
          {album.imageUrl && (
            <img src={album.imageUrl} alt="" className="w-full h-full object-cover blur-3xl opacity-20 scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/80 to-void" />
        </div>

        {/* Content */}
        <div className="relative px-8 pt-12 pb-8 flex items-end gap-6">
          {/* Cover */}
          <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-elevated">
            {album.imageUrl ? (
              <img src={album.imageUrl} alt={album.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-sonic" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pb-2">
            <p className="text-xs font-semibold text-sonic uppercase tracking-wider mb-2">
              {album.albumType || 'Album'}
            </p>
            <h1 className="font-display font-bold text-4xl text-ink mb-3 line-clamp-2">{album.title}</h1>
            <div className="flex items-center gap-2 text-sm text-ink-dim">
              <span className="font-medium text-ink">{album.artist?.name}</span>
              {album.releaseYear && <><span>·</span><span>{album.releaseYear}</span></>}
              <span>·</span>
              <span>{songs.length} songs</span>
              <span>·</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="px-8 py-4 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-sonic hover:bg-sonic-light
            text-white font-semibold text-sm transition-all shadow-sonic hover:shadow-glow-sm hover:scale-105"
        >
          <PlayIcon size={18} fill="currentColor" />
          Play
        </button>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-2 px-5 py-3 rounded-full border border-rim hover:border-muted
            text-ink-dim hover:text-ink text-sm font-medium transition-all"
        >
          <ShuffleIcon size={16} />
          Shuffle
        </button>
        <button
          className="p-2.5 rounded-full border border-rim hover:border-muted text-ink-ghost
            hover:text-ink transition-all"
          aria-label="Save album"
        >
          <HeartIcon size={18} />
        </button>
      </div>

      {/* ── Track List ─────────────────────────────────────────────────────── */}
      <div className="px-5">
        {/* Header */}
        <div className="flex items-center px-3 py-2 mb-1 border-b border-rim/50">
          <div className="w-7 text-xs text-ink-ghost text-center">#</div>
          <div className="flex-1 text-xs font-semibold text-ink-ghost uppercase tracking-wider ml-3">Title</div>
          <div className="w-24 text-xs font-semibold text-ink-ghost uppercase tracking-wider text-right pr-12">Duration</div>
        </div>

        {songs.map((song: any, i: number) => (
          <SongRow
            key={song.id}
            song={song}
            index={i}
            queue={songs}
            contextType="album"
            contextId={album.id}
            showAlbum={false}
          />
        ))}
      </div>
    </div>
  );
}

function AlbumSkeleton() {
  return (
    <div className="px-8 pt-12 pb-8 animate-fade-in">
      <div className="flex items-end gap-6 mb-8">
        <Skeleton className="w-48 h-48 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="w-64 h-9" />
          <Skeleton className="w-48 h-4" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-ink-dim">Album not found.</p>
    </div>
  );
}
