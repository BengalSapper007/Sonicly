'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchApi, artworkUrl, type RecentSearchEntry, type RecordRecentSearchPayload } from '@/lib/api';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/stores/auth.store';
import { usePlayerStore, type Song } from '@/stores/player.store';
import Link from 'next/link';
import {
  Search,
  X,
  Music,
  Headphones,
  Radio,
  Sparkles,
  Zap,
  Mic2,
  Disc,
  ListMusic,
  Clock,
  Trash2,
  Play,
  User,
} from 'lucide-react';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import {
  getLocalRecentSearches,
  addLocalRecentSearch,
  removeLocalRecentSearch,
  clearLocalRecentSearches,
} from '@/lib/search-history';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const debouncedQuery = useDebounce(query, 250); // fast 250ms debounce
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchEntry[]>([]);
  const { isAuthenticated } = useAuthStore();
  const { playSong, currentSong, isPlaying } = usePlayerStore();

  // Load recent searches on mount and when auth changes
  const loadRecent = async () => {
    if (isAuthenticated) {
      try {
        const res = await searchApi.getRecent();
        setRecentSearches(res.data);
      } catch {
        setRecentSearches(getLocalRecentSearches());
      }
    } else {
      setRecentSearches(getLocalRecentSearches());
    }
  };

  useEffect(() => {
    loadRecent();
  }, [isAuthenticated]);

  // Sync initial query if URL changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  // Dynamic search execution
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchApi.search(debouncedQuery)
      .then((r) => {
        setResults(r.data);
        const data = r.data;
        if (data?.songs?.length || data?.albums?.length || data?.artists?.length) {
          saveRecent({ type: 'QUERY', query: debouncedQuery });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const saveRecent = async (
    payload: RecordRecentSearchPayload,
    hydrated?: { song?: any; artist?: any; album?: any; playlist?: any }
  ) => {
    if (isAuthenticated) {
      try {
        const res = await searchApi.recordRecent(payload);
        setRecentSearches((prev) => [
          res.data,
          ...prev.filter((p) => p.id !== res.data.id),
        ].slice(0, 12));
      } catch {
        const updated = addLocalRecentSearch(payload, hydrated);
        setRecentSearches(updated);
      }
    } else {
      const updated = addLocalRecentSearch(payload, hydrated);
      setRecentSearches(updated);
    }
  };

  const handleRecentClick = (q: string) => {
    setQuery(q);
    saveRecent({ type: 'QUERY', query: q });
  };

  const handleRemoveRecent = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
    if (isAuthenticated) {
      try {
        await searchApi.removeRecent(id);
      } catch {
        removeLocalRecentSearch(id);
      }
    } else {
      removeLocalRecentSearch(id);
    }
  };

  const handleClearAll = async () => {
    setRecentSearches([]);
    if (isAuthenticated) {
      try {
        await searchApi.clearRecent();
      } catch {
        clearLocalRecentSearches();
      }
    } else {
      clearLocalRecentSearches();
    }
  };

  const handleSongClick = (song: Song) => {
    saveRecent({ type: 'SONG', songId: song.id }, { song });
    playSong(song, [song], 'search');
  };

  const handleArtistClick = (artist: any) => {
    saveRecent({ type: 'ARTIST', artistId: artist.id }, { artist });
    router.push(`/artist/${artist.id}`);
  };

  const handleAlbumClick = (album: any) => {
    saveRecent({ type: 'ALBUM', albumId: album.id }, { album });
    router.push(`/album/${album.id}`);
  };

  const hasResults = results && (
    results.songs?.length || results.albums?.length || results.artists?.length
  );

  const recentQueries = recentSearches.filter((e) => e.type === 'QUERY' && e.query);
  const recentEntities = recentSearches.filter((e) => e.type !== 'QUERY');

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
            className="w-full bg-midnight-blue border-2 border-prussian-blue/50 focus:border-vibrant-saffron text-white placeholder:text-on-primary-muted rounded-xl py-3 pl-12 pr-12 font-semibold outline-none transition-colors text-sm shadow-inner"
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
              <Skeleton key={i} className="h-14 rounded-xl shimmer" />
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
                    <div
                      key={song.id}
                      onClick={() => saveRecent({ type: 'SONG', songId: song.id }, { song })}
                    >
                      <SongRow
                        song={song}
                        index={i}
                        queue={results.songs}
                        contextType="search"
                        contextTitle={`Search: "${query}"`}
                        showAlbum
                      />
                    </div>
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
                    <div
                      key={album.id}
                      onClick={() => saveRecent({ type: 'ALBUM', albumId: album.id }, { album })}
                    >
                      <AlbumCard album={album} />
                    </div>
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
                    <div
                      key={artist.id}
                      onClick={() => saveRecent({ type: 'ARTIST', artistId: artist.id }, { artist })}
                    >
                      <ArtistCard artist={artist} />
                    </div>
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

        {/* ── Browse All & Recent Searches (empty state) ───────────────────────── */}
        {!query && (
          <div className="space-y-8">
            {/* Recent Searches section */}
            {recentSearches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-vibrant-saffron" />
                    <h2 className="font-bold text-lg text-on-surface">Recent Searches</h2>
                  </div>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-xs font-medium text-on-surface-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear all
                  </button>
                </div>

                {/* Recent Entities (Cards) */}
                {recentEntities.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {recentEntities.slice(0, 5).map((entry) => {
                      if (entry.type === 'ARTIST' && entry.artist) {
                        const a = entry.artist;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleArtistClick(a)}
                            className="group relative bg-surface border border-border-light rounded-xl p-3 hover:border-vibrant-saffron transition-all cursor-pointer text-center"
                          >
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-10"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-sand mb-2 shadow-xs">
                              {a.imageKey ? (
                                <img
                                  src={artworkUrl(a.imageKey)}
                                  alt={a.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                  <User className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            <p className="font-semibold text-sm text-ink truncate group-hover:text-vibrant-saffron">
                              {a.name}
                            </p>
                            <p className="text-xs text-on-surface-muted">Artist</p>
                          </div>
                        );
                      }

                      if (entry.type === 'ALBUM' && entry.album) {
                        const al = entry.album;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleAlbumClick(al)}
                            className="group relative bg-surface border border-border-light rounded-xl p-3 hover:border-vibrant-saffron transition-all cursor-pointer"
                          >
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-10"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="aspect-square rounded-lg overflow-hidden bg-sand mb-2 shadow-xs">
                              {al.imageKey ? (
                                <img
                                  src={artworkUrl(al.imageKey)}
                                  alt={al.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                  <Disc className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            <p className="font-semibold text-sm text-ink truncate group-hover:text-vibrant-saffron">
                              {al.title}
                            </p>
                            <p className="text-xs text-on-surface-muted truncate">
                              Album • {al.artist?.name || 'Artist'}
                            </p>
                          </div>
                        );
                      }

                      if (entry.type === 'SONG' && entry.song) {
                        const s = entry.song;
                        const isThisPlaying = currentSong?.id === s.id && isPlaying;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleSongClick(s)}
                            className="group relative bg-surface border border-border-light rounded-xl p-3 hover:border-vibrant-saffron transition-all cursor-pointer"
                          >
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all z-10"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-sand mb-2 shadow-xs">
                              {s.album?.imageKey ? (
                                <img
                                  src={artworkUrl(s.album.imageKey)}
                                  alt={s.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                  <Music className="w-8 h-8" />
                                </div>
                              )}
                              <div
                                className={`absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity ${
                                  isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                            <p className="font-semibold text-sm text-ink truncate group-hover:text-vibrant-saffron">
                              {s.title}
                            </p>
                            <p className="text-xs text-on-surface-muted truncate">
                              Song • {s.album?.artist?.name || 'Artist'}
                            </p>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

                {/* Recent Queries (Pills) */}
                {recentQueries.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {recentQueries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => handleRecentClick(entry.query!)}
                        className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border-light text-sm font-medium text-on-surface hover:border-vibrant-saffron hover:text-vibrant-saffron transition-all shadow-xs"
                      >
                        <Search className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 text-vibrant-saffron" />
                        <span>{entry.query}</span>
                        <span
                          role="button"
                          aria-label={`Remove ${entry.query} from history`}
                          onClick={(e) => handleRemoveRecent(entry.id, e)}
                          className="ml-1 opacity-40 hover:opacity-100 hover:text-red-500 transition-opacity p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Browse All */}
            <div>
              <div className="border-l-4 border-vibrant-saffron pl-3 mb-4">
                <h2 className="font-bold text-lg text-on-surface">Browse All</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {GENRES.map(({ label, bg, text, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setQuery(label)}
                    className="relative h-20 md:h-24 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 text-left shadow-sm"
                    style={{ background: bg }}
                  >
                    <span
                      className="absolute bottom-3 left-4 font-bold text-sm md:text-base"
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
        <Skeleton className="h-12 w-96 rounded-xl shimmer mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
