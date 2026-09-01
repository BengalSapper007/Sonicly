'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchApi } from '@/lib/api';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import { Search, X, Music, Headphones, Radio, Sparkles, Zap, Mic2, Disc, ListMusic } from 'lucide-react';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { ArtistCard } from '@/components/catalog/ArtistCard';

const GENRES = [
  { label: 'Pop',        bg: '#E8720C', text: '#14213D', icon: Sparkles },
  { label: 'Hip Hop',    bg: '#14213D', text: '#ffffff', icon: Mic2 },
  { label: 'Electronic', bg: '#146B3A', text: '#ffffff', icon: Radio },
  { label: 'Rock',       bg: '#B85A08', text: '#ffffff', icon: Zap },
  { label: 'Lo-Fi',      bg: '#0C1626', text: '#E8720C', icon: Headphones },
  { label: 'Podcasts',   bg: '#14213D', text: '#E8720C', icon: Music },
  { label: 'Jazz',       bg: '#146B3A', text: '#fff3e0', icon: Disc },
  { label: 'Classical',  bg: '#E8720C', text: '#14213D', icon: ListMusic },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults(null); return; }
    setLoading(true);
    searchApi.search(debouncedQuery)
      .then((r) => setResults(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const hasResults = results && (
    results.songs?.length || results.albums?.length || results.artists?.length
  );

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
