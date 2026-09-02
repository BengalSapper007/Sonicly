'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchApi } from '@/lib/api';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import { Search, X, Music, Headphones, Radio, Sparkles, Zap, Mic2, Disc, ListMusic, Clock, Trash2 } from 'lucide-react';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import { addSearch, getSearchHistory, clearSearchHistory, removeSearch } from '@/lib/search-history';

const GENRES = [
  { label: 'Pop',        bg: '#E2720A', text: '#1B2447', icon: Sparkles },
  { label: 'Hip Hop',    bg: '#1B2447', text: '#ffffff', icon: Mic2 },
  { label: 'Electronic', bg: '#0F6B45', text: '#ffffff', icon: Radio },
  { label: 'Rock',       bg: '#B85B08', text: '#ffffff', icon: Zap },
  { label: 'Lo-Fi',      bg: '#12192F', text: '#E2720A', icon: Headphones },
  { label: 'Podcasts',   bg: '#1B2447', text: '#E2720A', icon: Music },
  { label: 'Jazz',       bg: '#0F6B45', text: '#fff3e0', icon: Disc },
  { label: 'Classical',  bg: '#E2720A', text: '#1B2447', icon: ListMusic },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults(null); return; }
    setLoading(true);
    searchApi.search(debouncedQuery)
      .then((r) => {
        setResults(r.data);
        // Persist to search history if results were found
        const data = r.data;
        if (data?.songs?.length || data?.albums?.length || data?.artists?.length) {
          addSearch(debouncedQuery);
          setRecentSearches(getSearchHistory());
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const hasResults = results && (
    results.songs?.length || results.albums?.length || results.artists?.length
  );

  const handleRecentClick = (q: string) => setQuery(q);

  const handleRemoveRecent = (q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSearch(q);
    setRecentSearches(getSearchHistory());
  };

  const handleClearAll = () => {
    clearSearchHistory();
    setRecentSearches([]);
  };

  return (
    <div className="min-h-full pb-24 bg-background">

      {/* ── Search Header ────────────────────────────────────────────────────── */}
      <div className="bg-prussian-blue border-b-2 border-midnight-blue px-4 md:px-8 pt-5 pb-5">
        <h1 className="font-black text-2xl text-white mb-4">Search</h1>
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artists, songs, albums…"
            className="w-full bg-midnight-blue border-2 border-prussian-blue/50 focus:border-vibrant-saffron text-white placeholder:text-on-primary-muted rounded py-3 pl-12 pr-12 font-semibold outline-none transition-colors text-sm"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults(null); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-primary-muted hover:text-vibrant-saffron transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 py-6">
        {/* ── Loading ──────────────────────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded shimmer" />
            ))}
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────────────── */}
        {!loading && hasResults && (
          <div className="space-y-8">
            {/* Songs */}
            {results.songs?.length > 0 && (
              <section>
                <div className="border-l-4 border-vibrant-saffron pl-3 mb-3">
                  <h2 className="font-bold text-lg text-prussian-blue">Songs</h2>
                </div>
                <div className="divide-y divide-prussian-blue/5">
                  {results.songs.map((song: any, i: number) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={i}
                      queue={results.songs}
                      contextType="search"
                      showAlbum
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {results.albums?.length > 0 && (
              <section>
                <div className="border-l-4 border-vibrant-saffron pl-3 mb-3">
                  <h2 className="font-bold text-lg text-prussian-blue">Albums</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {results.albums.map((album: any) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {results.artists?.length > 0 && (
              <section>
                <div className="border-l-4 border-crisp-green pl-3 mb-3">
                  <h2 className="font-bold text-lg text-prussian-blue">Artists</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {results.artists.map((artist: any) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── No results ───────────────────────────────────────────────────────── */}
        {!loading && results && !hasResults && (
          <div className="py-16 text-center">
            <Search className="w-12 h-12 mx-auto text-prussian-blue/20 mb-4" />
            <p className="font-bold text-prussian-blue">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-on-surface-muted mt-1 font-medium">Try a different search term</p>
          </div>
        )}

        {/* ── Browse All (empty state) ──────────────────────────────────────────── */}
        {!query && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-vibrant-saffron" />
                    <h2 className="font-semibold text-base text-on-surface">Recent Searches</h2>
                  </div>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-xs text-on-surface-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleRecentClick(q)}
                      className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border-light text-sm font-medium text-on-surface hover:border-vibrant-saffron hover:text-vibrant-saffron transition-all"
                    >
                      <Search className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      {q}
                      <span
                        role="button"
                        aria-label={`Remove ${q} from history`}
                        onClick={(e) => handleRemoveRecent(q, e)}
                        className="ml-0.5 opacity-40 hover:opacity-100 hover:text-red-500 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Browse All */}
            <div>
              <div className="border-l-4 border-vibrant-saffron pl-3 mb-4">
                <h2 className="font-semibold text-lg text-on-surface">Browse All</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {GENRES.map(({ label, bg, text, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setQuery(label)}
                    className="relative h-20 md:h-24 rounded-lg overflow-hidden transition-all hover:-translate-y-0.5 text-left"
                    style={{ background: bg }}
                  >
                    <span
                      className="absolute bottom-3 left-4 font-semibold text-sm md:text-base"
                      style={{ color: text }}
                    >
                      {label}
                    </span>
                    <Icon
                      className="absolute top-3 right-3 w-8 h-8 opacity-30"
                      style={{ color: text }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full bg-background p-8">
        <Skeleton className="h-12 w-96 rounded shimmer mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded shimmer" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
