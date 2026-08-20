'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Play, Shuffle, Heart } from 'lucide-react';
import { albumsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatDuration } from '@/lib/utils';

export default function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayerStore();

  useEffect(() => {
    albumsApi
      .get(albumId)
      .then((r) => setAlbum(r.data))
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
    <div className="min-h-full pb-16">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-end gap-6">
          {/* Cover */}
          <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl bg-zinc-950">
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
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
              {album.type || 'Album'}
            </span>
            <h1
              className="font-black text-3xl md:text-5xl text-white my-2 tracking-tight line-clamp-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {album.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400 font-medium">
              <span className="text-zinc-100 font-semibold">{album.artist?.name}</span>
              {album.releaseYear && (
                <>
                  <span>•</span>
                  <span>{album.releaseYear}</span>
                </>
              )}
              <span>•</span>
              <span>{songs.length} songs</span>
              <span>•</span>
              <span className="font-mono">{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="px-8 py-4 flex items-center gap-3">
        <button
          onClick={handlePlayAll}
          className="btn-primary flex items-center gap-2 px-6 py-2.5 font-bold shadow-lg"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
          <span>Play</span>
        </button>
        <button
          onClick={handleShuffle}
          className="btn-glass flex items-center gap-2 px-5 py-2.5 font-semibold"
        >
          <Shuffle className="w-4 h-4 text-zinc-300" />
          <span>Shuffle</span>
        </button>
        <button
          className="p-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-all"
          aria-label="Save album"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* ── Track List ─────────────────────────────────────────────────────── */}
      <div className="px-6 mt-4">
        <div className="flex items-center px-4 py-2 mb-2 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          <div className="w-6 text-center">#</div>
          <div className="flex-1 ml-3.5">Title</div>
          <div className="w-20 text-right pr-10">Duration</div>
        </div>

        <div className="space-y-1">
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
    <div className="px-8 pt-10 pb-8 animate-fade-in">
      <div className="flex items-end gap-6 mb-8">
        <Skeleton className="w-48 h-48 rounded-2xl shimmer" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-20 h-4 shimmer rounded" />
          <Skeleton className="w-72 h-10 shimmer rounded-lg" />
          <Skeleton className="w-48 h-4 shimmer rounded" />
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

function NotFound() {
  return (
    <div className="flex items-center justify-center h-64 text-zinc-400">
      <p>Album not found.</p>
    </div>
  );
}
