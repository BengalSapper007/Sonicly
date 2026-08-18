'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { PlayIcon, ShuffleIcon, PlusIcon } from 'lucide-react';
import { playlistsApi } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDuration } from '@/lib/utils';

export default function PlaylistPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = use(params);
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayerStore();

  useEffect(() => {
    playlistsApi.get(playlistId)
      .then(r => setPlaylist(r.data))
      .finally(() => setLoading(false));
  }, [playlistId]);

  if (loading) return <PlaylistSkeleton />;
  if (!playlist) return <div className="p-8 text-ink-dim">Playlist not found.</div>;

  const songs = playlist.songs?.map((ps: any) => ps.song).filter(Boolean) || [];
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s?.duration || 0), 0);

  return (
    <div className="min-h-full pb-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          {playlist.imageUrl && (
            <img src={playlist.imageUrl} alt="" className="w-full h-full object-cover blur-3xl opacity-15 scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/80 to-void" />
        </div>

        <div className="relative px-8 pt-12 pb-8 flex items-end gap-6">
          <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-elevated">
            {playlist.imageUrl ? (
              <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-sonic flex items-center justify-center">
                <span className="text-white text-5xl opacity-50">♪</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <p className="text-xs font-semibold text-sonic uppercase tracking-wider mb-2">Playlist</p>
            <h1 className="font-display font-bold text-4xl text-ink mb-2 line-clamp-2">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-sm text-ink-dim mb-3 line-clamp-2">{playlist.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-ink-dim">
              <span>{songs.length} songs</span>
              <span>·</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => playQueue(songs, 0, 'playlist', playlistId)}
          disabled={!songs.length}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-sonic hover:bg-sonic-light
            text-white font-semibold text-sm transition-all shadow-sonic hover:scale-105 disabled:opacity-50"
        >
          <PlayIcon size={18} fill="currentColor" />
          Play
        </button>
        <button
          onClick={() => {
            if (!songs.length) return;
            const idx = Math.floor(Math.random() * songs.length);
            playQueue(songs, idx, 'playlist', playlistId);
          }}
          disabled={!songs.length}
          className="flex items-center gap-2 px-5 py-3 rounded-full border border-rim hover:border-muted
            text-ink-dim hover:text-ink text-sm font-medium transition-all disabled:opacity-50"
        >
          <ShuffleIcon size={16} />
          Shuffle
        </button>
      </div>

      {/* ── Track list ───────────────────────────────────────────────────── */}
      <div className="px-5">
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
            contextType="playlist"
            contextId={playlistId}
            showAlbum={true}
          />
        ))}
      </div>
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="px-8 pt-12 pb-8 animate-fade-in">
      <div className="flex items-end gap-6 mb-8">
        <Skeleton className="w-48 h-48 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-72 h-9" />
          <Skeleton className="w-48 h-4" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
