'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Play, Pause, Shuffle, Heart, MoreHorizontal, Clock, User, ListMusic } from 'lucide-react';
import { playlistsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatDuration } from '@/lib/utils';
import Link from 'next/link';

export default function PlaylistPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = use(params);
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue, currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    playlistsApi
      .get(playlistId)
      .then((r) => setPlaylist(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playlistId]);

  if (loading) return <PlaylistSkeleton />;
  if (!playlist) {
    return (
      <div className="p-12 text-center text-zinc-400">
        Playlist not found.
      </div>
    );
  }

  const songs = playlist.songs?.map((ps: any) => ps.song).filter(Boolean) || [];
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s?.duration || 0), 0);
  const cover = playlist.coverUrl || artworkUrl(playlist.imageKey);

  return (
    <div className="min-h-full pb-16 relative">
      {/* ── Playlist Header ────────────────────────────────────────────────── */}
      <div className="px-8 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-8">
          {/* Cover art */}
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden flex-shrink-0 relative group shadow-2xl bg-zinc-950">
            <ArtworkImage
              src={cover}
              alt={playlist.name}
              type="playlist"
              id={playlist.id}
              size="lg"
              className="w-full h-full object-cover"
            />
            {/* Hover play button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => playQueue(songs, 0, 'playlist', playlistId)}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-cyan-400 text-cyan-950 shadow-xl hover:scale-110 transition-transform"
                style={{ boxShadow: '0 0 24px rgba(76, 215, 246, 0.6)' }}
                title="Play Playlist"
              >
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex-1 min-w-0 pb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-300">
              Curated Playlist
            </span>

            <h1
              className="font-black text-3xl md:text-5xl text-white my-2 tracking-tight line-clamp-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {playlist.name}
            </h1>

            {playlist.description && (
              <p className="text-sm text-zinc-300 mb-3 max-w-2xl leading-relaxed">
                {playlist.description}
              </p>
            )}

            {/* Meta line */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400 font-medium mb-4">
              <span className="text-zinc-100 font-semibold">Sonicly Curators</span>
              <span>•</span>
              <span>{songs.length} songs</span>
              {totalDuration > 0 && (
                <>
                  <span>•</span>
                  <span className="font-mono">{formatDuration(totalDuration)}</span>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => playQueue(songs, 0, 'playlist', playlistId)}
                disabled={!songs.length}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 font-bold shadow-lg disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play</span>
              </button>
              <button
                onClick={() => {
                  if (!songs.length) return;
                  const idx = Math.floor(Math.random() * songs.length);
                  playQueue(songs, idx, 'playlist', playlistId);
                }}
                disabled={!songs.length}
                className="btn-glass flex items-center gap-2 px-4 py-2.5 disabled:opacity-50"
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4 text-zinc-300" />
                <span>Shuffle</span>
              </button>
              <button
                className="p-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-all"
                title="Like playlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Track Table ────────────────────────────────────────────────────── */}
      <div className="px-6 mt-4">
        <div className="flex items-center px-4 py-2 mb-2 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          <div className="w-6 text-center">#</div>
          <div className="flex-1 ml-3.5">Title</div>
          <div className="w-20 text-right pr-10">
            <Clock className="w-3.5 h-3.5 inline-block" />
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <ListMusic className="w-12 h-12 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm">No songs in this playlist yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
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
        )}
      </div>
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="px-8 pt-10 pb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
        <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shimmer" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-24 h-4 shimmer rounded" />
          <Skeleton className="w-80 h-10 shimmer rounded-lg" />
          <Skeleton className="w-64 h-4 shimmer rounded" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl shimmer" />
        ))}
      </div>
    </div>
  );
}
