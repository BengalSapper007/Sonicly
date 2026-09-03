'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Bell,
  LogOut,
  Library,
  Heart,
  Clock,
  X,
  Play,
  Music,
  Disc,
  User,
  ListMusic,
  ArrowRight,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { usePlayerStore, type Song } from '@/stores/player.store';
import {
  searchApi,
  artworkUrl,
  type RecentSearchEntry,
  type RecordRecentSearchPayload,
} from '@/lib/api';
import {
  getLocalRecentSearches,
  addLocalRecentSearch,
  removeLocalRecentSearch,
  clearLocalRecentSearches,
} from '@/lib/search-history';

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { playSong, currentSong, isPlaying } = usePlayerStore();

  // Search input & popover state
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    songs: any[];
    artists: any[];
    albums: any[];
    playlists: any[];
  } | null>(null);

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<RecentSearchEntry[]>([]);

  // Profile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  const loadRecentSearches = async () => {
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
    loadRecentSearches();
  }, [isAuthenticated]);

  // Handle outside clicks to close search popover and profile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dynamic as-you-type search debouncing
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchApi.search(trimmed, 'all');
        setSuggestions(res.data);
      } catch (err) {
        console.error('Dynamic search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 220); // 220ms debounce for responsive live typing

    return () => clearTimeout(timer);
  }, [query]);

  // Record a search (query or entity)
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

  // Remove single recent item
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

  // Clear all recent searches
  const handleClearAllRecent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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

  // Form submit -> navigate to search page
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    saveRecent({ type: 'QUERY', query: trimmed });
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // Select query from recent search
  const handleSelectRecentQuery = (q: string) => {
    setQuery(q);
    saveRecent({ type: 'QUERY', query: q });
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  // Select entity (Song, Artist, Album, Playlist)
  const handleSelectSong = (song: Song) => {
    saveRecent({ type: 'SONG', songId: song.id }, { song });
    setIsOpen(false);
    playSong(song, [song], 'search');
  };

  const handleSelectArtist = (artist: any) => {
    saveRecent({ type: 'ARTIST', artistId: artist.id }, { artist });
    setIsOpen(false);
    router.push(`/artist/${artist.id}`);
  };

  const handleSelectAlbum = (album: any) => {
    saveRecent({ type: 'ALBUM', albumId: album.id }, { album });
    setIsOpen(false);
    router.push(`/album/${album.id}`);
  };

  const handleSelectPlaylist = (playlist: any) => {
    saveRecent({ type: 'PLAYLIST', playlistId: playlist.id }, { playlist });
    setIsOpen(false);
    router.push(`/playlist/${playlist.id}`);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    router.push('/');
  };

  const hasSuggestions =
    suggestions &&
    (suggestions.songs?.length > 0 ||
      suggestions.artists?.length > 0 ||
      suggestions.albums?.length > 0 ||
      suggestions.playlists?.length > 0);

  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-4 md:px-8 relative z-40"
      style={{ height: 'var(--header-height)', background: '#F6F1E4' }}
    >
      {/* Logo — mobile only */}
      <Link href="/" className="md:hidden flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white font-bold text-sm shadow-sm">
          S
        </div>
      </Link>

      {/* Dynamic Search Bar Container (Desktop) */}
      <div
        ref={searchContainerRef}
        className="relative flex-1 max-w-lg hidden md:block"
      >
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => {
              setIsOpen(true);
              loadRecentSearches();
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
              }
            }}
            placeholder="Search artists, songs, albums…"
            className="w-full bg-paper border border-sand focus:border-saffron focus:ring-2 focus:ring-saffron/20 rounded-full py-2 pl-10 pr-9 text-sm text-ink placeholder:text-ink-muted outline-none transition-all shadow-sm"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-saffron animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions(null);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-ink-muted hover:text-ink transition-colors rounded-full hover:bg-sand/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </form>

        {/* ── Dropdown Popover ──────────────────────────────────────────────── */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full min-w-[390px] max-w-xl bg-paper rounded-2xl shadow-2xl border border-sand py-2 z-50 animate-fadeIn max-h-[72vh] overflow-y-auto overflow-x-hidden divide-y divide-sand/50">
            {/* 1. DYNAMIC SUGGESTIONS (when user typed query) */}
            {query.trim().length > 0 ? (
              <div>
                {isLoading && !suggestions && (
                  <div className="py-8 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-saffron" />
                    <span>Searching Sonicly catalog…</span>
                  </div>
                )}

                {!isLoading && !hasSuggestions && (
                  <div className="py-8 text-center px-4">
                    <p className="text-sm font-semibold text-ink">
                      No results found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-ink-muted mt-1">
                      Try searching by artist name, track title, or album.
                    </p>
                  </div>
                )}

                {hasSuggestions && (
                  <div className="py-1">
                    {/* Songs */}
                    {suggestions.songs?.length > 0 && (
                      <div className="py-2">
                        <div className="px-3.5 pb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                          <span>Songs</span>
                        </div>
                        <div className="space-y-0.5 px-1.5">
                          {suggestions.songs.slice(0, 4).map((s: any) => {
                            const isThisPlaying = currentSong?.id === s.id && isPlaying;
                            return (
                              <div
                                key={s.id}
                                onClick={() => handleSelectSong(s)}
                                className="group flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                              >
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-sand/80 shadow-xs">
                                  {s.album?.imageKey ? (
                                    <img
                                      src={artworkUrl(s.album.imageKey)}
                                      alt={s.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                      <Music className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div
                                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                                      isThisPlaying
                                        ? 'opacity-100'
                                        : 'opacity-0 group-hover:opacity-100'
                                    }`}
                                  >
                                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                    {s.title}
                                  </p>
                                  <p className="text-xs text-ink-muted truncate">
                                    {s.album?.artist?.name || 'Unknown Artist'}
                                  </p>
                                </div>
                                <span className="text-[11px] font-medium text-ink-muted flex-shrink-0">
                                  {formatDuration(s.duration)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Artists */}
                    {suggestions.artists?.length > 0 && (
                      <div className="py-2 border-t border-sand/40">
                        <div className="px-3.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                          Artists
                        </div>
                        <div className="space-y-0.5 px-1.5">
                          {suggestions.artists.slice(0, 3).map((a: any) => (
                            <div
                              key={a.id}
                              onClick={() => handleSelectArtist(a)}
                              className="group flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                            >
                              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-sand shadow-xs">
                                {a.imageKey ? (
                                  <img
                                    src={artworkUrl(a.imageKey)}
                                    alt={a.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                    <User className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                  {a.name}
                                </p>
                                <p className="text-xs text-ink-muted">Artist</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Albums */}
                    {suggestions.albums?.length > 0 && (
                      <div className="py-2 border-t border-sand/40">
                        <div className="px-3.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                          Albums
                        </div>
                        <div className="space-y-0.5 px-1.5">
                          {suggestions.albums.slice(0, 3).map((al: any) => (
                            <div
                              key={al.id}
                              onClick={() => handleSelectAlbum(al)}
                              className="group flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                            >
                              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-sand shadow-xs">
                                {al.imageKey ? (
                                  <img
                                    src={artworkUrl(al.imageKey)}
                                    alt={al.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                    <Disc className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                  {al.title}
                                </p>
                                <p className="text-xs text-ink-muted truncate">
                                  Album • {al.artist?.name || 'Artist'} {al.releaseYear ? `(${al.releaseYear})` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* See all results link */}
                    <div className="pt-2 px-2 border-t border-sand/40">
                      <button
                        onClick={() => handleSearchSubmit()}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-saffron hover:bg-saffron/10 transition-colors text-left"
                      >
                        <span className="truncate">
                          See all results for &ldquo;{query}&rdquo;
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 ml-2 flex-shrink-0" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 2. RECENT SEARCHES (Spotify-Style Entities + Queries) */
              <div>
                <div className="flex items-center justify-between px-3.5 pt-1.5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-saffron" />
                    <span className="text-xs font-bold uppercase tracking-wider text-ink">
                      Recent Searches
                    </span>
                  </div>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={handleClearAllRecent}
                      className="text-[11px] font-medium text-ink-muted hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>

                {recentSearches.length === 0 ? (
                  <div className="py-6 px-4 text-center">
                    <p className="text-xs text-ink-muted">
                      No recent searches yet. Search for songs, artists, or albums to build your history!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5 px-1.5 pb-1 max-h-[50vh] overflow-y-auto">
                    {recentSearches.map((entry) => {
                      // Case A: Typed Query
                      if (entry.type === 'QUERY' && entry.query) {
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleSelectRecentQuery(entry.query!)}
                            className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-sand/70 flex items-center justify-center text-ink-muted flex-shrink-0 group-hover:text-saffron transition-colors">
                                <Clock className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                {entry.query}
                              </span>
                            </div>
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="p-1 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all flex-shrink-0 ml-2"
                              title="Remove from history"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      // Case B: Song Entity
                      if (entry.type === 'SONG' && entry.song) {
                        const s = entry.song;
                        const isThisPlaying = currentSong?.id === s.id && isPlaying;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleSelectSong(s)}
                            className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-sand shadow-xs">
                                {s.album?.imageKey ? (
                                  <img
                                    src={artworkUrl(s.album.imageKey)}
                                    alt={s.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                    <Music className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                <div
                                  className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                                    isThisPlaying
                                      ? 'opacity-100'
                                      : 'opacity-0 group-hover:opacity-100'
                                  }`}
                                >
                                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                  {s.title}
                                </p>
                                <p className="text-xs text-ink-muted truncate">
                                  Song • {s.album?.artist?.name || 'Artist'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="p-1 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all flex-shrink-0 ml-2"
                              title="Remove from history"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      // Case C: Artist Entity
                      if (entry.type === 'ARTIST' && entry.artist) {
                        const a = entry.artist;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleSelectArtist(a)}
                            className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-sand shadow-xs">
                                {a.imageKey ? (
                                  <img
                                    src={artworkUrl(a.imageKey)}
                                    alt={a.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                    <User className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                  {a.name}
                                </p>
                                <p className="text-xs text-ink-muted">Artist</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="p-1 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all flex-shrink-0 ml-2"
                              title="Remove from history"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      // Case D: Album Entity
                      if (entry.type === 'ALBUM' && entry.album) {
                        const al = entry.album;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleSelectAlbum(al)}
                            className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-sand shadow-xs">
                                {al.imageKey ? (
                                  <img
                                    src={artworkUrl(al.imageKey)}
                                    alt={al.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-ink-muted">
                                    <Disc className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                  {al.title}
                                </p>
                                <p className="text-xs text-ink-muted truncate">
                                  Album • {al.artist?.name || 'Artist'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="p-1 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all flex-shrink-0 ml-2"
                              title="Remove from history"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      // Case E: Playlist Entity
                      if (entry.type === 'PLAYLIST' && entry.playlist) {
                        const pl = entry.playlist;
                        return (
                          <div
                            key={entry.id}
                            onClick={() => handleSelectPlaylist(pl)}
                            className="group flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-sand/60 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-saffron/10 flex items-center justify-center text-saffron shadow-xs">
                                <ListMusic className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">
                                  {pl.name}
                                </p>
                                <p className="text-xs text-ink-muted truncate">
                                  Playlist • {pl._count?.songs ?? 0} songs
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleRemoveRecent(entry.id, e)}
                              className="p-1 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all flex-shrink-0 ml-2"
                              title="Remove from history"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right side: Profile & Notifications */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-auto">
        {isAuthenticated && (
          <button
            className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-sand/50 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
        )}

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-indigo text-white flex items-center justify-center font-semibold text-sm flex-shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-sm"
              title={user?.displayName || 'User Profile'}
            >
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-paper rounded-xl shadow-lg border border-sand py-1.5 z-50 animate-fadeIn">
                <div className="px-4 py-2.5 border-b border-sand">
                  <p className="text-sm font-semibold text-ink truncate">
                    {user?.displayName || 'User'}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-ink-muted truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>

                <div className="py-1">
                  <Link
                    href="/library"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink hover:bg-sand/50 transition-colors"
                  >
                    <Library className="w-4 h-4 text-ink-muted" />
                    <span>Your Library</span>
                  </Link>
                  <Link
                    href="/library/liked"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink hover:bg-sand/50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-ink-muted" />
                    <span>Liked Songs</span>
                  </Link>
                </div>

                <div className="border-t border-sand pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn-primary text-sm px-4 py-2">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
