'use client';
import { useEffect, useState, useCallback, use } from 'react';
import { Play, Shuffle, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { albumsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatDuration } from '@/lib/utils';

export default function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { playQueue } = usePlayerStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    albumsApi
      .get(albumId)
      .then((r) => { setAlbum(r.data); setSaved(r.data.isSaved ?? false); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [albumId]);

  const handleSave = useCallback(async () => {
    if (!isAuthenticated || saveLoading) return;
    setSaved((p) => !p);
    setSaveLoading(true);
    try {
      saved ? await albumsApi.unsave(albumId) : await albumsApi.save(albumId);
    } catch {
      setSaved((p) => !p);
    } finally {
      setSaveLoading(false);
    }
  }, [isAuthenticated, saved, saveLoading, albumId]);

  if (loading) return <AlbumSkeleton />;
  if (!album) return (
    <div className="flex items-center justify-center h-64 text-on-surface-muted font-semibold">
      Album not found.
    </div>
  );

  const songs = album.songs || [];
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);

  return (
    <div className="min-h-full pb-24 bg-background">

      {/* ── Album Hero Header ──────────────────────────────────────────────── */}
      <section className="border-b border-border-light px-4 md:px-8 pt-8 pb-6 bg-surface-raised">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 max-w-5xl mx-auto">
          {/* Cover Art */}
          <div className="w-36 h-36 md:w-48 md:h-48 flex-shrink-0 overflow-hidden rounded-lg">
            <ArtworkImage
              src={artworkUrl(album.imageKey)}
              alt={album.title}
              type="album"
              id={album.id}
              size="lg"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pb-1">
            <span className="inline-block text-sm font-medium text-vibrant-saffron mb-2">
              {album.albumType || 'Album'}
            </span>
            <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl text-on-surface tracking-tight mb-2 line-clamp-2">
              {album.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-on-surface-muted">
              <span className="font-semibold text-on-surface">{album.artist?.name}</span>
              {album.releaseYear && <span>{`, ${album.releaseYear}`}</span>}
              <span>{`, ${songs.length} songs`}</span>
              <span>{`, ${formatDuration(totalDuration)}`}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Action Bar ──────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 py-4 flex items-center gap-3 border-b border-border-light bg-surface">
        <button
          onClick={() => playQueue(songs, 0, 'album', album.id)}
          disabled={!songs.length}
          className="btn-primary disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          Play
        </button>
        <button
          onClick={() => {
            const idx = Math.floor(Math.random() * songs.length);
            playQueue(songs, idx, 'album', album.id);
          }}
          disabled={!songs.length}
          className="btn-secondary disabled:opacity-50"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </button>

        {isAuthenticated && (
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`p-2.5 rounded border-2 transition-all flex items-center justify-center ${
              saved
                ? 'border-prussian-blue bg-prussian-blue text-white'
                : 'border-prussian-blue text-prussian-blue hover:bg-prussian-blue hover:text-white'
            }`}
            aria-label={saved ? 'Remove from library' : 'Save to library'}
          >
            {saveLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* ── Track List ──────────────────────────────────────────────────────── */}
      <div className="px-2 md:px-6 mt-2">
        {/* Table header */}
        <div className="hidden sm:flex items-center px-3 py-2 mb-1 border-b border-border-light text-xs font-medium text-on-surface-muted">
          <div className="w-8 text-center">#</div>
          <div className="flex-1 ml-2">Title</div>
          <div className="w-20 text-right pr-8">Duration</div>
        </div>

        <div className="divide-y divide-prussian-blue/5">
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
    </div>
  );
}

function AlbumSkeleton() {
  return (
    <div className="pb-24 bg-background animate-fade-in">
      <div className="bg-vibrant-saffron/30 border-b-2 border-prussian-blue/20 px-4 md:px-8 pt-8 pb-6">
        <div className="flex flex-col sm:flex-row items-end gap-5">
          <Skeleton className="w-36 h-36 md:w-48 md:h-48 shimmer" />
          <div className="flex-1 space-y-3">
            <Skeleton className="w-16 h-4 rounded shimmer" />
            <Skeleton className="w-72 h-10 rounded shimmer" />
            <Skeleton className="w-48 h-4 rounded shimmer" />
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-4 divide-y divide-prussian-blue/5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded shimmer my-1" />
        ))}
      </div>
    </div>
  );
}
