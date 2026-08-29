'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchApi, artworkUrl } from '@/lib/api';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import {
  Search,
  X,
  History,
  Music,
  User,
  Disc,
  ListMusic,
  Headphones,
  Radio,
  Sparkles,
  Zap,
  Cloud,
  SearchX,
} from 'lucide-react';

const GENRES = [
  {
    label: 'Synthwave',
    gradient: 'linear-gradient(135deg, #d0bcff 0%, #ffb0cd 100%)',
    icon: Music,
  },
  {
    label: 'Lo-Fi Beats',
    gradient: 'linear-gradient(135deg, #4cd7f6 0%, #a078ff 100%)',
    icon: Headphones,
  },
  {
    label: 'Techno',
    gradient: 'linear-gradient(135deg, #aa0266 0%, #131316 100%)',
    icon: Radio,
  },
  {
    label: 'Pop',
    gradient: 'linear-gradient(135deg, #ffb0cd 0%, #d0bcff 100%)',
    icon: Sparkles,
  },
  {
    label: 'Ambient',
    gradient: 'linear-gradient(135deg, #009eb9 0%, #003640 100%)',
    icon: Cloud,
  },
  {
    label: 'Rock',
    gradient: 'linear-gradient(135deg, #d0bcff 0%, #494454 100%)',
    icon: Zap,
  },
  {
    label: 'Dream Pop',
    gradient: 'linear-gradient(135deg, #d0bcff 0%, #4cd7f6 100%)',
    icon: Cloud,
  },
];

const RECENT_SEARCHES = ['Cyberpunk 2077 OST', 'Synthwave Mix', 'The Midnight', 'Neon Nights'];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

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
    <div className="min-h-full pb-16">
      {/* ── Large Search Header ────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 px-8 py-5"
        style={{
          background: 'rgba(19, 19, 22, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="relative max-w-2xl group">
          <div
            className="flex items-center rounded-full px-5 py-3.5 gap-3.5 shadow-lg"
            style={{
              background: 'rgba(42, 42, 45, 0.75)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <Search className="w-5 h-5 text-purple-300 flex-shrink-0" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              autoFocus
              className="bg-transparent border-none outline-none flex-1 text-base text-zinc-100 placeholder-zinc-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* ── No query — Browse view ─────────────────────────────────────────── */}
        {!query && (
          <>
            {/* Recent Searches */}
            <section className="mb-8">
              <h2
                className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <History className="w-4 h-4 text-pink-300" />
                <span>Recent Searches</span>
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {RECENT_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-300 bg-zinc-800/60 border border-white/5 hover:border-white/20 hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {/* Browse All Genre Grid */}
            <section>
              <h2
                className="text-xl font-bold text-zinc-100 mb-5"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Browse All Genres
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {GENRES.map((g) => {
                  const Icon = g.icon;
                  return (
                    <div
                      key={g.label}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 p-5 flex flex-col justify-between shadow-lg hover:-translate-y-1 hover:shadow-2xl"
                      style={{ background: g.gradient }}
                      onClick={() => setQuery(g.label)}
                    >
                      <h3
                        className="font-black text-white text-xl drop-shadow-md z-10 tracking-tight"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {g.label}
                      </h3>
                      <Icon className="w-12 h-12 text-white/30 absolute bottom-3 right-3 transition-transform group-hover:scale-110 group-hover:text-white/50" />
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* ── Loading state ──────────────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-28 mb-4 shimmer rounded" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-14 rounded-xl shimmer" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── No results ─────────────────────────────────────────────────────── */}
        {!loading && results && !hasResults && (
          <div className="text-center py-20 text-zinc-400">
            <SearchX className="w-16 h-16 mx-auto text-zinc-600 mb-3" />
            <p className="text-lg font-semibold text-zinc-200">
              No results found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Please check your spelling or search for another artist or song.
            </p>
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────────────── */}
        {!loading && hasResults && (
          <div className="space-y-8 animate-fade-in">
            {/* Songs */}
            {results.songs?.length > 0 && (
              <section>
                <h2
                  className="font-bold text-base text-zinc-200 mb-3 flex items-center gap-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Music className="w-4 h-4 text-purple-300" />
                  <span>Songs</span>
                </h2>
                <div className="space-y-1">
                  {results.songs.slice(0, 8).map((song: any, i: number) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={i}
                      queue={results.songs}
                      contextType="search"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {results.artists?.length > 0 && (
              <section>
                <h2
                  className="font-bold text-base text-zinc-200 mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <User className="w-4 h-4 text-pink-300" />
                  <span>Artists</span>
                </h2>
                <div className="flex gap-5 flex-wrap">
                  {results.artists.map((artist: any) => (
                    <Link
                      key={artist.id}
                      href={`/artist/${artist.id}`}
                      className="group text-center block w-28"
                    >
                      <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-2 shadow-lg ring-2 ring-transparent group-hover:ring-purple-400/50 transition-all">
                        <ArtworkImage
                          src={artworkUrl(artist.imageKey)}
                          alt={artist.name}
                          type="artist"
                          id={artist.id}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-sm font-semibold text-zinc-200 truncate group-hover:text-purple-300 transition-colors">
                        {artist.name}
                      </p>
                      <p className="text-xs text-zinc-400">Artist</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {results.albums?.length > 0 && (
              <section>
                <h2
                  className="font-bold text-base text-zinc-200 mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Disc className="w-4 h-4 text-cyan-300" />
                  <span>Albums</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {results.albums.map((album: any) => (
                    <Link
                      key={album.id}
                      href={`/album/${album.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-2.5 shadow-lg bg-zinc-950">
                        <ArtworkImage
                          src={artworkUrl(album.imageKey)}
                          alt={album.title}
                          type="album"
                          id={album.id}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-sm font-semibold text-zinc-200 truncate group-hover:text-purple-300 transition-colors">
                        {album.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {album.artist?.name}
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
          <Skeleton className="h-12 w-64 rounded-full shimmer" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
