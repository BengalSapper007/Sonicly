'use client';
import { useState, useCallback } from 'react';
import { songsApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

interface UseLikeReturn {
  liked: boolean;
  isLoading: boolean;
  toggle: (e?: React.MouseEvent) => Promise<void>;
}

export function useLike(songId: string, initialLiked: boolean): UseLikeReturn {
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const toggle = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!isAuthenticated || isLoading) return;

    // Optimistic update
    setLiked((prev) => !prev);
    setIsLoading(true);

    try {
      if (liked) {
        await songsApi.unlike(songId);
      } else {
        await songsApi.like(songId);
      }
    } catch {
      // Revert on failure
      setLiked((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading, liked, songId]);

  return { liked, isLoading, toggle };
}
