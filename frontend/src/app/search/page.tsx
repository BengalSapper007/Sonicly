'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, XIcon } from 'lucide-react';
import { searchApi } from '@/lib/api';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import { PlaylistCard } from '@/components/catalog/PlaylistCard';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    searchApi.search(debouncedQuery)
      .then(r => setResults(r.data))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const hasResults = results && (
    results.songs?.length || results.albums?.length ||
    results.artists?.length || results.playlists?.length
  );

  return (
    <div className="min-h-full pb-8">
      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-void/80 backdrop-blur-xl border-b border-rim/30 px-8 py-4">
        <div className="relative max-w-xl">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            autoFocus
            className="w-full bg-surface border border-rim rounded-xl pl-11 pr-10 py-3
              text-ink placeholder-ink-ghost text-sm focus:outline-none focus:border-sonic
              focus:ring-1 focus:ring-sonic/30 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink transition-colors"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="px-8 py-6">
        {!query && <SearchHint />}

        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-12 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results && !hasResults && (
          <div className="text-center py-16">
            <p className="text-ink-dim">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-ink-ghost text-sm mt-1">Try different keywords</p>
          </div>
        )}

        {!loading && hasResults && (
          <div className="space-y-8 animate-fade-in">
            {/* Songs */}
            {results.songs?.length > 0 && (
              <section>
                <h2 className="font-display font-semibold text-base text-ink mb-3">Songs</h2>
                <div className="space-y-1">
                  {results.songs.slice(0, 5).map((song: any, i: number) => (
                    <SongRow key={song.id} song={song} index={i} queue={results.songs} />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {results.artists?.length > 0 && (
              <section>
                <h2 className="font-display font-semibold text-base text-ink mb-3">Artists</h2>
                <div className="flex gap-4 flex-wrap">
                  {results.artists.map((artist: any) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {results.albums?.length > 0 && (
              <section>
                <h2 className="font-display font-semibold text-base text-ink mb-3">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.albums.map((album: any) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}

            {/* Playlists */}
            {results.playlists?.length > 0 && (
              <section>
                <h2 className="font-display font-semibold text-base text-ink mb-3">Playlists</h2>
                <div className="flex gap-4 flex-wrap">
                  {results.playlists.map((pl: any) => (
                    <PlaylistCard key={pl.id} playlist={pl} size="sm" />
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

function SearchHint() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-surface border border-rim flex items-center justify-center mx-auto mb-4">
        <SearchIcon size={28} className="text-sonic" />
      </div>
      <h2 className="font-display font-semibold text-xl text-ink mb-2">Find your music</h2>
      <p className="text-ink-dim text-sm">Search for songs, artists, albums and playlists.</p>
    </div>
  );
}
