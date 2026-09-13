import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  imageUrl?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;   // JWT — persisted so Bearer auth survives page refresh
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; displayName: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ email, password });
          set({
            user: res.data.user,
            token: res.data.token ?? null,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(data);
          set({
            user: res.data.user,
            token: res.data.token ?? null,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (err) {
          console.warn('[Auth] Server logout error (proceeding with local cleanup):', err);
        }

        // 1. Reset in-memory auth state
        set({ user: null, token: null, isAuthenticated: false });

        // 2. Clear persisted Zustand auth storage & remove localStorage key
        try {
          useAuthStore.persist?.clearStorage?.();
        } catch {}
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sonicly-auth');
          }
        } catch {}

        // 3. Clear session storage completely (stream cache, device session ID, redirect target, etc.)
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.clear();
          }
        } catch {}

        // 4. Clear search history from local storage
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sonicly_recent_searches_v2');
            localStorage.removeItem('sonicly_search_history');
          }
        } catch {}

        // 5. Expire client-accessible cookies for sonicly_token
        try {
          if (typeof document !== 'undefined') {
            document.cookie = 'sonicly_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0';
          }
        } catch {}

        // 6. Stop and release any playing audio element
        try {
          if (typeof document !== 'undefined') {
            const audios = document.querySelectorAll('audio');
            audios.forEach((audio) => {
              audio.pause();
              audio.removeAttribute('src');
              audio.load();
            });
          }
        } catch {}
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const res = await authApi.me();
          set({ user: res.data.user, isAuthenticated: true });
        } catch (err: any) {
          /**
           * Only clear auth when the server explicitly rejects the token.
           * Network errors, backend restarts (503), or transient failures
           * must NOT log the user out — we keep the persisted localStorage
           * state until the server says the token is genuinely invalid.
           */
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            set({ user: null, token: null, isAuthenticated: false });
          }
          // else: backend is temporarily unavailable — preserve session
        } finally {
          set({ isLoading: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'sonicly-auth',
      // Persist user data AND the token so Bearer auth survives page refresh
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

