'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchApi, artworkUrl } from '@/lib/api';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

interface CategoryConfig {
  label: string;
  bgColor: string;
  textColor: string;
  shadowClass: string;
  colSpan?: string;
  aspect?: string;
}

const CATEGORIES: CategoryConfig[] = [
  { label: 'Pop', bgColor: 'bg-vibrant-saffron', textColor: 'text-prussian-blue', shadowClass: 'shadow-[4px_4px_0px_0px_rgba(0,49,83,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,49,83,1)]' },
  { label: 'Hip Hop', bgColor: 'bg-crisp-green', textColor: 'text-white', shadowClass: 'shadow-[4px_4px_0px_0px_rgba(0,49,83,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,49,83,1)]' },
  { label: 'Electronic', bgColor: 'bg-prussian-blue', textColor: 'text-white', shadowClass: 'shadow-[4px_4px_0px_0px_rgba(255,136,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,136,0,1)]' },
  { label: 'Rock', bgColor: 'bg-vibrant-saffron', textColor: 'text-prussian-blue', shadowClass: 'shadow-[4px_4px_0px_0px_rgba(0,49,83,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,49,83,1)]' },
  { label: 'Podcasts', bgColor: 'bg-crisp-green', textColor: 'text-white', shadowClass: 'shadow-[4px_4px_0px_0px_rgba(0,49,83,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,49,83,1)]', colSpan: 'md:col-span-2', aspect: 'md:aspect-auto' },
  { label: 'Jazz', bgColor: 'bg-prussian-blue', textColor: 'text-white', shadowClass: 'shadow-[4px_4px_0px_0px_rgba(255,136,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,136,0,1)]' },
  { label: 'Classical', bgColor: 'bg-vibrant-saffron', textColor: 'text-prussian-blue', shadowClass: 'shadow-[4px_4px_0px_0px_rgba(0,49,83,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,49,83,1)]' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const { logout } = useAuthStore();

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    searchApi
      .search(debouncedQuery)
      .then((r) => setResults(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const hasResults =
    results &&
    (results.songs?.length ||
      results.albums?.length ||
      results.artists?.length ||
      results.playlists?.length);

  return (
    <div className="min-h-full pb-24 md:pb-32 bg-background text-on-background">
      {/* ── TopNavBar (Desktop) ──────────────────────────────────────────────── */}
      <header className="hidden md:flex justify-between items-center h-16 px-margin-desktop bg-prussian-blue border-b-2 border-midnight-blue sticky top-0 z-30 transition-all duration-200">
        <div className="flex gap-6 items-center">
          <Link href="/" className="font-headline-md text-headline-md font-black text-vibrant-saffron">
            Sonicly
          </Link>
          <Link href="/search" className="text-on-primary-container hover:text-vibrant-saffron font-label-md text-label-md transition-colors">
            Podcasts
          </Link>
          <Link href="/search" className="text-on-primary-container hover:text-vibrant-saffron font-label-md text-label-md transition-colors">
            Audiobooks
          </Link>
          <Link href="/search" className="text-on-primary-container hover:text-vibrant-saffron font-label-md text-label-md transition-colors">
            Live
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-vibrant-saffron transition-colors p-1" title="Notifications">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="text-white hover:text-vibrant-saffron transition-colors p-1" title="Settings">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button
            onClick={() => logout()}
            className="bg-vibrant-saffron text-prussian-blue font-label-md text-xs px-4 py-1.5 rounded font-bold hover:bg-white transition-colors border border-prussian-blue"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Search Canvas ───────────────────────────────────────────────────── */}
      <div className="p-margin-mobile md:p-margin-desktop flex-1">
        {/* Search Bar Section */}
        <div className="max-w-4xl mx-auto mb-stack-xl">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-prussian-blue font-bold text-2xl">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              autoFocus
              className="w-full bg-white border-2 border-prussian-blue focus:border-vibrant-saffron focus:ring-0 rounded-full py-4 pl-14 pr-12 font-body-lg text-body-lg text-prussian-blue placeholder:text-outline-variant transition-colors shadow-[4px_4px_0px_0px_rgba(0,49,83,1)] outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 text-prussian-blue hover:text-vibrant-saffron p-1"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Browse Categories (No query) ────────────────────────────────────── */}
        {!query && (
          <div className="max-w-6xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-prussian-blue mb-stack-md flex items-center gap-4">
              <span className="w-2 h-8 bg-vibrant-saffron rounded-full"></span>
              Browse All
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  onClick={() => setQuery(cat.label)}
                  className={`group relative overflow-hidden rounded-xl ${cat.bgColor} ${cat.aspect || 'aspect-square'} ${cat.colSpan || ''} p-5 flex flex-col justify-between border-2 border-prussian-blue ${cat.shadowClass} hover:translate-y-[-4px] transition-all cursor-pointer select-none`}
                >
                  <h3 className={`font-headline-md text-headline-md ${cat.textColor} font-bold z-10 break-words`}>
                    {cat.label}
                  </h3>
                  <div className="flex justify-end">
                    <span className="material-symbols-outlined text-4xl opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all">
                      music_note
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Loading state ──────────────────────────────────────────────────── */}
        {loading && (
          <div className="max-w-6xl mx-auto space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-4 shimmer rounded" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-14 rounded border border-prussian-blue/10 shimmer" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── No results ─────────────────────────────────────────────────────── */}
        {!loading && results && !hasResults && (
          <div className="text-center py-20 text-prussian-blue">
            <span className="material-symbols-outlined text-6xl text-outline mb-2">search_off</span>
            <p className="text-lg font-bold">
              No results found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-outline mt-1 font-medium">
              Please check your spelling or search for another artist, song, or genre.
            </p>
          </div>
        )}

        {/* ── Search Results ──────────────────────────────────────────────────── */}
        {!loading && hasResults && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Songs */}
            {results.songs?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-l-4 border-vibrant-saffron pl-3">
                  <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
                    Songs
                  </h3>
                </div>
                <div className="space-y-1">
                  {results.songs.slice(0, 8).map((song: any, i: number) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={i}
                      queue={results.songs}
                      contextType="search"
                      showAlbum={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {results.artists?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-l-4 border-crisp-green pl-3">
                  <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
                    Artists
                  </h3>
                </div>
                <div className="flex gap-5 flex-wrap">
                  {results.artists.map((artist: any) => (
                    <Link
                      key={artist.id}
                      href={`/artist/${artist.id}`}
                      className="group text-center block w-28"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-prussian-blue shadow-md bg-midnight-blue group-hover:border-vibrant-saffron transition-colors">
                        <ArtworkImage
                          src={artworkUrl(artist.imageKey)}
                          alt={artist.name}
                          type="artist"
                          id={artist.id}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-label-md text-xs text-prussian-blue truncate font-bold group-hover:text-vibrant-saffron transition-colors">
                        {artist.name}
                      </h4>
                      <p className="font-caption text-[10px] text-outline">Artist</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {results.albums?.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-l-4 border-prussian-blue pl-3">
                  <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
                    Albums
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {results.albums.map((album: any) => (
                    <Link
                      key={album.id}
                      href={`/album/${album.id}`}
                      className="group bg-surface border-2 border-prussian-blue p-3 rounded hover:-translate-y-1 transition-transform hard-shadow shadow-prussian-blue flex flex-col"
                    >
                      <div className="relative aspect-square mb-2.5 overflow-hidden border border-prussian-blue bg-surface-variant">
                        <ArtworkImage
                          src={artworkUrl(album.imageKey)}
                          alt={album.title}
                          type="album"
                          id={album.id}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-label-md text-xs text-prussian-blue truncate font-bold group-hover:text-vibrant-saffron transition-colors">
                        {album.title}
                      </h4>
                      <p className="font-caption text-[11px] text-outline truncate mt-0.5">
                        {album.artist?.name || 'Album'}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-14 w-full max-w-4xl rounded-full border-2 border-prussian-blue/20 shimmer" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
