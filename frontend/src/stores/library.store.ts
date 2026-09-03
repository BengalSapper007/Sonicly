import { create } from 'zustand';
import { libraryApi, songsApi, albumsApi, artistsApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { usePlayerStore } from '@/stores/player.store';
import { toast } from '@/stores/toast.store';

interface LibraryState {
  likedSongIds: Set<string>;
  savedAlbumIds: Set<string>;
  followedArtistIds: Set<string>;
  isInitialized: boolean;

  loadingLikes: Record<string, boolean>;
  loadingAlbums: Record<string, boolean>;
  loadingArtists: Record<string, boolean>;

  initLibrary: () => Promise<void>;
  registerSong: (songId: string, isLiked: boolean) => void;
  registerAlbum: (albumId: string, isSaved: boolean) => void;
  registerArtist: (artistId: string, isFollowing: boolean) => void;

  isSongLiked: (songId: string) => boolean;
  isAlbumSaved: (albumId: string) => boolean;
  isArtistFollowed: (artistId: string) => boolean;

  toggleLikeSong: (song: { id: string; title?: string; [key: string]: any }) => Promise<boolean>;
  toggleSaveAlbum: (albumId: string, albumTitle?: string) => Promise<boolean>;
  toggleFollowArtist: (artistId: string, artistName?: string) => Promise<boolean>;
}

function promptLogin(actionText: string) {
  toast.info(`Please sign in to ${actionText}`, {
    label: 'Sign In',
    onClick: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  likedSongIds: new Set<string>(),
  savedAlbumIds: new Set<string>(),
  followedArtistIds: new Set<string>(),
  isInitialized: false,

  loadingLikes: {},
  loadingAlbums: {},
  loadingArtists: {},

  initLibrary: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) return;

    try {
      const [likedSongsRes, savedAlbumsRes, followedArtistsRes] = await Promise.all([
        libraryApi.likedSongs(),
        libraryApi.savedAlbums(),
        libraryApi.followedArtists(),
      ]);

      const likedSongIds = new Set<string>(
        (likedSongsRes.data || []).map((s: any) => s.id)
      );
      const savedAlbumIds = new Set<string>(
        (savedAlbumsRes.data || []).map((a: any) => a.id)
      );
      const followedArtistIds = new Set<string>(
        (followedArtistsRes.data || []).map((a: any) => a.id)
      );

      set({
        likedSongIds,
        savedAlbumIds,
        followedArtistIds,
        isInitialized: true,
      });
    } catch (err) {
      console.error('Failed to initialize library store:', err);
    }
  },

  registerSong: (songId: string, isLiked: boolean) => {
    const { likedSongIds } = get();
    if (isLiked && !likedSongIds.has(songId)) {
      const updated = new Set(likedSongIds);
      updated.add(songId);
      set({ likedSongIds: updated });
    }
  },

  registerAlbum: (albumId: string, isSaved: boolean) => {
    const { savedAlbumIds } = get();
    if (isSaved && !savedAlbumIds.has(albumId)) {
      const updated = new Set(savedAlbumIds);
      updated.add(albumId);
      set({ savedAlbumIds: updated });
    }
  },

  registerArtist: (artistId: string, isFollowing: boolean) => {
    const { followedArtistIds } = get();
    if (isFollowing && !followedArtistIds.has(artistId)) {
      const updated = new Set(followedArtistIds);
      updated.add(artistId);
      set({ followedArtistIds: updated });
    }
  },

  isSongLiked: (songId: string) => {
    return get().likedSongIds.has(songId);
  },

  isAlbumSaved: (albumId: string) => {
    return get().savedAlbumIds.has(albumId);
  },

  isArtistFollowed: (artistId: string) => {
    return get().followedArtistIds.has(artistId);
  },

  toggleLikeSong: async (song) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      promptLogin('like tracks and save them to your library');
      return false;
    }

    const { likedSongIds, loadingLikes } = get();
    if (loadingLikes[song.id]) return likedSongIds.has(song.id);

    const currentlyLiked = likedSongIds.has(song.id);
    const newLiked = !currentlyLiked;

    // Optimistic update
    const updated = new Set(likedSongIds);
    if (newLiked) {
      updated.add(song.id);
    } else {
      updated.delete(song.id);
    }

    set({
      likedSongIds: updated,
      loadingLikes: { ...loadingLikes, [song.id]: true },
    });

    // Synchronize player store
    usePlayerStore.getState().setSongLiked(song.id, newLiked);

    if (newLiked) {
      toast.success(`Added "${song.title || 'Track'}" to Liked Songs`);
    } else {
      toast.info(`Removed "${song.title || 'Track'}" from Liked Songs`);
    }

    try {
      if (newLiked) {
        await songsApi.like(song.id);
      } else {
        await songsApi.unlike(song.id);
      }
      return newLiked;
    } catch (err) {
      console.error('Failed to toggle song like:', err);
      // Rollback
      const reverted = new Set(get().likedSongIds);
      if (currentlyLiked) {
        reverted.add(song.id);
      } else {
        reverted.delete(song.id);
      }
      set({ likedSongIds: reverted });
      usePlayerStore.getState().setSongLiked(song.id, currentlyLiked);
      toast.error('Could not update like status');
      return currentlyLiked;
    } finally {
      set((state) => {
        const next = { ...state.loadingLikes };
        delete next[song.id];
        return { loadingLikes: next };
      });
    }
  },

  toggleSaveAlbum: async (albumId: string, albumTitle?: string) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      promptLogin('save albums to your library');
      return false;
    }

    const { savedAlbumIds, loadingAlbums } = get();
    if (loadingAlbums[albumId]) return savedAlbumIds.has(albumId);

    const currentlySaved = savedAlbumIds.has(albumId);
    const newSaved = !currentlySaved;

    // Optimistic update
    const updated = new Set(savedAlbumIds);
    if (newSaved) {
      updated.add(albumId);
    } else {
      updated.delete(albumId);
    }

    set({
      savedAlbumIds: updated,
      loadingAlbums: { ...loadingAlbums, [albumId]: true },
    });

    if (newSaved) {
      toast.success(`Saved "${albumTitle || 'Album'}" to your library`);
    } else {
      toast.info(`Removed "${albumTitle || 'Album'}" from your library`);
    }

    try {
      if (newSaved) {
        await albumsApi.save(albumId);
      } else {
        await albumsApi.unsave(albumId);
      }
      return newSaved;
    } catch (err) {
      console.error('Failed to toggle album save:', err);
      // Rollback
      const reverted = new Set(get().savedAlbumIds);
      if (currentlySaved) {
        reverted.add(albumId);
      } else {
        reverted.delete(albumId);
      }
      set({ savedAlbumIds: reverted });
      toast.error('Could not update saved album status');
      return currentlySaved;
    } finally {
      set((state) => {
        const next = { ...state.loadingAlbums };
        delete next[albumId];
        return { loadingAlbums: next };
      });
    }
  },

  toggleFollowArtist: async (artistId: string, artistName?: string) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      promptLogin('follow artists and stay updated');
      return false;
    }

    const { followedArtistIds, loadingArtists } = get();
    if (loadingArtists[artistId]) return followedArtistIds.has(artistId);

    const currentlyFollowing = followedArtistIds.has(artistId);
    const newFollowing = !currentlyFollowing;

    // Optimistic update
    const updated = new Set(followedArtistIds);
    if (newFollowing) {
      updated.add(artistId);
    } else {
      updated.delete(artistId);
    }

    set({
      followedArtistIds: updated,
      loadingArtists: { ...loadingArtists, [artistId]: true },
    });

    if (newFollowing) {
      toast.success(`Following ${artistName || 'Artist'}`);
    } else {
      toast.info(`Unfollowed ${artistName || 'Artist'}`);
    }

    try {
      if (newFollowing) {
        await artistsApi.follow(artistId);
      } else {
        await artistsApi.unfollow(artistId);
      }
      return newFollowing;
    } catch (err) {
      console.error('Failed to toggle artist follow:', err);
      // Rollback
      const reverted = new Set(get().followedArtistIds);
      if (currentlyFollowing) {
        reverted.add(artistId);
      } else {
        reverted.delete(artistId);
      }
      set({ followedArtistIds: reverted });
      toast.error('Could not update follow status');
      return currentlyFollowing;
    } finally {
      set((state) => {
        const next = { ...state.loadingArtists };
        delete next[artistId];
        return { loadingArtists: next };
      });
    }
  },
}));
