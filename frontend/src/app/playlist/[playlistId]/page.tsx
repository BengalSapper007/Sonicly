'use client';
import { useEffect, useState, use } from 'react';
import { Play, Pause, Shuffle } from 'lucide-react';
import { playlistsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatDuration } from '@/lib/utils';

export default function PlaylistPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = use(params);
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue, currentSong, isPlaying, togglePlay } = usePlayerStore();

  useEffect(() => {
    playlistsApi.get(playlistId)
      .then((r) => setPlaylist(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playlistId]);

  if (loading) return <PlaylistSkeleton />;
  if (!playlist) return (
    <div className="p-12 text-center text-on-surface-muted font-semibold">Playlist not found.</div>
  );

  const songs = playlist.songs?.map((ps: any) => ps.song).filter(Boolean) || [];
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s?.duration || 0), 0);
  const cover = playlist.coverUrl || artworkUrl(playlist.imageKey);
  const isThisPlaying = isPlaying && songs.some((s: any) => s?.id === currentSong?.id);

  const handlePlay = () => {
    if (isThisPlaying) togglePlay();
    else playQueue(songs, 0, 'playlist', playlistId);
  };
  const handleShuffle = () => {
    const idx = Math.floor(Math.random() * songs.length);
    playQueue(songs, idx, 'playlist', playlistId);
  };

  return (
    <div className="min-h-full pb-24 bg-background">

      {/* ── Playlist Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border-light px-4 md:px-8 pt-8 pb-6 bg-surface-raised">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 max-w-5xl mx-auto">
          {/* Cover Art */}
          <div className="w-36 h-36 md:w-52 md:h-52 flex-shrink-0 overflow-hidden rounded-lg">
            <ArtworkImage
              src={cover}
              alt={playlist.name}
              type="playlist"
              id={playlist.id}
              size="lg"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <span className="inline-block text-sm font-medium text-vibrant-saffron mb-2">
              Curated Playlist
            </span>
            <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl text-on-surface tracking-tight mb-2 line-clamp-2">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-sm text-on-surface-muted mb-2 line-clamp-2">
                {playlist.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-on-surface-muted">
              <span>{songs.length} songs</span>
              <span>{`, ${formatDuration(totalDuration)}`}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Actions ──────────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 border-b border-border-light bg-surface">
        <button
          onClick={handlePlay}
          disabled={!songs.length}
          className="btn-primary disabled:opacity-50"
        >
          {isThisPlaying ? (
            <><Pause className="w-4 h-4 fill-current" /> Pause</>
          ) : (
            <><Play className="w-4 h-4 fill-current" /> Play</>
          )}
        </button>
        <button
          onClick={handleShuffle}
          disabled={!songs.length}
          className="btn-secondary disabled:opacity-50"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </button>
      </div>

      {/* ── Track List ──────────────────────────────────────────────────────── */}
      <div className="px-2 md:px-6 mt-2">
        <div className="hidden sm:flex items-center px-3 py-2 mb-1 border-b border-border-light text-xs font-medium text-on-surface-muted">
          <div className="w-8 text-center">#</div>
          <div className="flex-1 ml-2">Title</div>
          <div className="w-20 text-right pr-8">Duration</div>
        </div>
        <div className="divide-y divide-prussian-blue/5">
          {songs.map((song: any, i: number) => (
            <SongRow
              key={song?.id || i}
              song={song}
              index={i}
              queue={songs}
              contextType="playlist"
              contextId={playlistId}
              showAlbum
            />
          ))}
        </div>
        {songs.length === 0 && (
          <div className="py-12 text-center text-on-surface-muted font-semibold">
            This playlist is empty.
          </div>
        )}
      </div>
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="pb-24 animate-fade-in">
      <div className="px-4 md:px-8 pt-8 pb-6 border-b-2 border-prussian-blue/20" style={{ background: '#E8720C' }}>
        <div className="flex flex-col sm:flex-row items-end gap-5">
          <Skeleton className="w-36 h-36 md:w-52 md:h-52 border-2 border-prussian-blue/20 shimmer" />
          <div className="flex-1 space-y-3">
            <Skeleton className="w-20 h-4 rounded shimmer" />
            <Skeleton className="w-72 h-10 rounded shimmer" />
            <Skeleton className="w-32 h-4 rounded shimmer" />
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-4 divide-y divide-prussian-blue/5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 shimmer my-1" />
        ))}
      </div>
    </div>
  );
}
