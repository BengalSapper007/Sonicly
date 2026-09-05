'use client';
import { useState } from 'react';
import Link from 'next/link';
import { artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { Play, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  initialAlbums: any[];
  initialPlaylists: any[];
  initialArtists: any[];
}

export function HomeView({
  initialAlbums,
  initialPlaylists,
  initialArtists,
}: HomeViewProps) {
  const { playQueue } = usePlayerStore();
  const [albums] = useState<any[]>(initialAlbums);
  const [playlists] = useState<any[]>(initialPlaylists);
  const [artists] = useState<any[]>(initialArtists);

  const featured = playlists[0] ?? albums[0];
  const featuredCover = featured ? artworkUrl(featured.imageKey) : null;

  return (
    <div className="min-h-full pb-24 bg-[#F6F1E4] text-ink">
      {/* ── Featured — liner-notes sleeve ────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-8 pb-4 flex flex-col sm:flex-row gap-6 md:gap-10 items-start">
        <div
          className="w-full sm:w-44 md:w-52 flex-shrink-0 mx-auto sm:mx-0 rounded-lg overflow-hidden"
          style={{ aspectRatio: '3 / 4', maxWidth: '208px' }}
        >
          <ArtworkImage
            src={featuredCover}
            alt={featured?.name ?? featured?.title ?? 'Discover Music'}
            type={featured?.name ? 'playlist' : 'album'}
            id={featured?.id ?? 'featured'}
            size="hero"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="pt-1 max-w-xl">
          <span className="inline-block mb-2 text-sm font-medium text-saffron">
            Featured release
          </span>
          <h1
            className="font-display font-semibold tracking-tight text-ink mb-3 line-clamp-2"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1 }}
          >
            {featured?.name ?? featured?.title ?? 'Discover Music'}
          </h1>
          {featured?.artist?.name && (
            <p className="text-ink-muted mb-5">{featured.artist.name}</p>
          )}
          <button
            className="btn-primary flex items-center gap-2 py-2.5"
            onClick={() => {
              if (featured?.songs?.length) {
                playQueue(
                  featured.songs.map((s: any) => s.song || s),
                  0,
                  'playlist',
                  featured.id,
                  featured.title
                );
              }
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Listen now</span>
          </button>
        </div>
      </section>

      {/* ── Jump Back In ─────────────────────────────────────────────────────── */}
      <ShelfSection title="Jump Back In" href="/albums">
        {albums.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-8 px-8">
            {albums.slice(0, 6).map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => {
                  if (album.songs?.length)
                    playQueue(album.songs, 0, 'album', album.id, album.title);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyShelf message="No albums available yet." />
        )}
      </ShelfSection>

      {/* ── Curated Playlists ────────────────────────────────────────────────── */}
      <ShelfSection title="Curated Playlists" href="/playlists" accentColor="emerald">
        {playlists.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-8 px-8">
            {playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        ) : (
          <EmptyShelf message="No playlists found." />
        )}
      </ShelfSection>

      {/* ── New Releases ──────────────────────────────────────────────────────── */}
      <ShelfSection title="New Releases" href="/albums">
        {albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.slice(0, 6).map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => {
                  if (album.songs?.length)
                    playQueue(album.songs, 0, 'album', album.id, album.title);
                }}
                grid
              />
            ))}
          </div>
        ) : (
          <EmptyShelf message="No new releases found." />
        )}
      </ShelfSection>

      {/* ── Artists ───────────────────────────────────────────────────────────── */}
      <ShelfSection title="Artists" href="/artists" accentColor="emerald">
        {artists.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 -mx-8 px-8">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <EmptyShelf message="No artists found." />
        )}
      </ShelfSection>
    </div>
  );
}

// ── Shelf Section ────────────────────────────────────────────────────────────
function ShelfSection({
  title,
  href,
  accentColor = 'saffron',
  children,
}: {
  title: string;
  href?: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  const borderClass = accentColor === 'emerald' ? 'border-emerald' : 'border-saffron';
  return (
    <section className="px-6 md:px-10 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`border-l-2 ${borderClass} pl-3`}>
          <h2 className="font-display font-semibold text-xl text-ink">{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="text-xs font-semibold text-ink-muted hover:text-saffron flex items-center gap-0.5 transition-colors"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

// ── Empty Shelf ──────────────────────────────────────────────────────────────
function EmptyShelf({ message }: { message: string }) {
  return (
    <div className="p-5 rounded-lg border border-border-light text-on-surface-muted text-sm text-center">
      {message}
    </div>
  );
}

// ── Album Card ───────────────────────────────────────────────────────────────
function AlbumCard({ album, onPlay, grid }: { album: any; onPlay?: () => void; grid?: boolean }) {
  const cover = artworkUrl(album.imageKey);
  return (
    <Link
      href={`/album/${album.id}`}
      className={`group cursor-pointer block ${grid ? '' : 'flex-none w-[160px]'}`}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 border border-border-light transition-colors group-hover:border-vibrant-saffron/50">
        <ArtworkImage
          src={cover}
          alt={album.title}
          type="album"
          id={album.id}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-prussian-blue/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              onPlay?.();
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-vibrant-saffron text-white hover:scale-105 transition-transform"
            title="Play Album"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-on-surface truncate group-hover:text-vibrant-saffron transition-colors">
        {album.title}
      </h3>
      <p className="text-xs text-on-surface-muted truncate mt-0.5">
        {album.artist?.name}
        {album.releaseYear && `, ${album.releaseYear}`}
      </p>
    </Link>
  );
}

// ── Artist Card ──────────────────────────────────────────────────────────────
function ArtistCard({ artist }: { artist: any }) {
  const photo = artworkUrl(artist.imageKey);
  return (
    <Link href={`/artist/${artist.id}`} className="group flex-none w-28 cursor-pointer block text-center">
      <div className="relative w-28 h-28 rounded-full overflow-hidden mx-auto mb-2 group-hover:ring-2 group-hover:ring-vibrant-saffron transition-all">
        <ArtworkImage
          src={photo}
          alt={artist.name}
          type="artist"
          id={artist.id}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="text-xs font-semibold text-on-surface truncate group-hover:text-vibrant-saffron transition-colors">
        {artist.name}
      </h3>
      <p className="text-[11px] text-on-surface-muted">Artist</p>
    </Link>
  );
}

// ── Playlist Card ─────────────────────────────────────────────────────────────
function PlaylistCard({ playlist }: { playlist: any }) {
  const cover = artworkUrl(playlist.coverUrl || playlist.imageKey);
  return (
    <Link href={`/playlist/${playlist.id}`} className="group flex-none w-[160px] cursor-pointer block">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 border-l-2 border-l-crisp-green border-y border-r border-border-light transition-colors">
        <ArtworkImage
          src={cover}
          alt={playlist.name}
          type="playlist"
          id={playlist.id}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-prussian-blue/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-crisp-green text-white hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <h3 className="text-sm font-bold text-prussian-blue truncate group-hover:text-vibrant-saffron transition-colors">
        {playlist.name}
      </h3>
      <p className="text-xs text-on-surface-muted line-clamp-2 mt-0.5">
        {playlist.description || `${playlist._count?.songs ?? playlist.songs?.length ?? 0} songs`}
      </p>
    </Link>
  );
}
