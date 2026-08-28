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
import Link from 'next/link';

export default function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { playQueue } = usePlayerStore();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    albumsApi
      .get(albumId)
      .then((r) => {
        setAlbum(r.data);
        setSaved(r.data.isSaved ?? false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [albumId]);

  const handleSave = useCallback(async () => {
    if (!isAuthenticated || saveLoading) return;
    setSaved((prev) => !prev);
    setSaveLoading(true);
    try {
      if (saved) {
        await albumsApi.unsave(albumId);
      } else {
        await albumsApi.save(albumId);
      }
    } catch {
      setSaved((prev) => !prev);
    } finally {
      setSaveLoading(false);
    }
  }, [isAuthenticated, saved, saveLoading, albumId]);

  if (loading) return <AlbumSkeleton />;
  if (!album) {
    return (
      <div className="p-12 text-center text-prussian-blue font-bold">
        Album not found.
      </div>
    );
  }

  const songs = album.songs || [];
  const totalDuration = songs.reduce((acc: number, s: any) => acc + (s.duration || 0), 0);

  const handlePlayAll = () => playQueue(songs, 0, 'album', album.id);
  const handleShuffle = () => {
    const idx = Math.floor(Math.random() * songs.length);
    playQueue(songs, idx, 'album', album.id);
  };

  return (
    <div className="min-h-full pb-24 md:pb-32 bg-background text-on-surface">
      {/* ── TopNavBar (Desktop) ──────────────────────────────────────────────── */}
      <header className="hidden md:flex justify-between items-center h-16 px-margin-desktop bg-prussian-blue sticky top-0 z-30 border-b-2 border-midnight-blue transition-all duration-200">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-headline-md text-headline-md font-black text-vibrant-saffron">
            Sonicly
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/search" className="font-label-md text-label-md text-on-primary-container hover:text-vibrant-saffron transition-colors">
              Podcasts
            </Link>
            <Link href="/search" className="font-label-md text-label-md text-on-primary-container hover:text-vibrant-saffron transition-colors">
              Audiobooks
            </Link>
            <Link href="/search" className="font-label-md text-label-md text-on-primary-container hover:text-vibrant-saffron transition-colors">
              Live
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-primary-container hover:text-vibrant-saffron transition-colors p-1" title="Settings">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button className="text-on-primary-container hover:text-vibrant-saffron transition-colors p-1" title="Notifications">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button
            onClick={() => logout()}
            className="font-label-md text-xs text-white hover:text-vibrant-saffron transition-colors border border-on-primary-container px-3 py-1 rounded"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Album Header (Saffron full bleed) ─────────────────────────────────── */}
      <section className="bg-vibrant-saffron px-margin-desktop py-stack-xl flex flex-col md:flex-row items-end gap-8 border-b-2 border-prussian-blue">
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 shadow-lg border-2 border-prussian-blue bg-white overflow-hidden">
          <ArtworkImage
            src={artworkUrl(album.imageKey)}
            alt={album.title}
            type="album"
            id={album.id}
            size="lg"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-prussian-blue">
          <p className="font-label-md text-label-md uppercase tracking-widest mb-2 font-bold">
            {album.albumType || 'Album'}
          </p>
          <h1 className="font-display-lg text-display-lg font-black mb-2">
            {album.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold mb-6">
            <span className="font-bold">{album.artist?.name || 'Artist'}</span>
            {album.releaseYear && (
              <>
                <span>•</span>
                <span>{album.releaseYear}</span>
              </>
            )}
            <span>•</span>
            <span>{songs.length} songs</span>
            <span>•</span>
            <span>{formatDuration(totalDuration)}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayAll}
              disabled={!songs.length}
              className="bg-prussian-blue text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-midnight-blue transition-all shadow-lg active:scale-95 group disabled:opacity-50"
              title="Play Album"
            >
              <span
                className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
            </button>

            <button
              onClick={handleShuffle}
              disabled={!songs.length}
              className="w-12 h-12 rounded-full border-2 border-prussian-blue flex items-center justify-center text-prussian-blue hover:bg-prussian-blue hover:text-white transition-colors"
              title="Shuffle"
            >
              <span className="material-symbols-outlined text-[22px]">shuffle</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="w-12 h-12 rounded-full border-2 border-prussian-blue flex items-center justify-center text-prussian-blue hover:bg-prussian-blue hover:text-white transition-colors"
                title={saved ? 'Remove from library' : 'Save to library'}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={saved ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {saved ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Track List ───────────────────────────────────────────────────────── */}
      <section className="px-margin-desktop py-stack-md bg-background flex-1">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 py-2 border-b-2 border-prussian-blue mb-4 text-prussian-blue font-label-md text-label-md px-4">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div className="w-16 text-right flex justify-end">
            <span className="material-symbols-outlined text-sm">schedule</span>
          </div>
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
      </section>
    </div>
  );
}

function AlbumSkeleton() {
  return (
    <div className="min-h-full pb-32 animate-fade-in">
      <div className="bg-vibrant-saffron/40 px-margin-desktop py-stack-xl flex flex-col md:flex-row items-end gap-8 border-b-2 border-prussian-blue">
        <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded border-2 border-prussian-blue/20 shimmer" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-20 h-4 rounded shimmer" />
          <Skeleton className="w-80 h-10 rounded shimmer" />
          <Skeleton className="w-48 h-4 rounded shimmer" />
        </div>
      </div>
      <div className="px-margin-desktop py-stack-md space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded border border-prussian-blue/10 shimmer" />
        ))}
      </div>
    </div>
  );
}
