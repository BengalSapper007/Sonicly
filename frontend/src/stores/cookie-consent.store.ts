import { create } from 'zustand';

export interface CookiePreferences {
  essential: true; // Always active
  functional: boolean;
  analytics: boolean;
}

interface CookieConsentState {
  consent: CookiePreferences | null;
  hasResponded: boolean;
  isPreferencesOpen: boolean;
  initConsent: () => void;
  acceptAll: () => void;
  acceptEssential: () => void;
  savePreferences: (prefs: { functional: boolean; analytics: boolean }) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const STORAGE_KEY = 'sonicly_cookie_consent';

export const useCookieConsentStore = create<CookieConsentState>((set) => ({
  consent: null,
  hasResponded: true, // Default to true until checked in client to avoid hydration flash
  isPreferencesOpen: false,

  initConsent: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          consent: {
            essential: true,
            functional: parsed.functional ?? true,
            analytics: parsed.analytics ?? true,
          },
          hasResponded: true,
        });
      } else {
        set({ hasResponded: false });
      }
    } catch {
      set({ hasResponded: false });
    }
  },

  acceptAll: () => {
    const preferences: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
    set({ consent: preferences, hasResponded: true, isPreferencesOpen: false });
  },

  acceptEssential: () => {
    const preferences: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
    set({ consent: preferences, hasResponded: true, isPreferencesOpen: false });
  },

  savePreferences: ({ functional, analytics }) => {
    const preferences: CookiePreferences = {
      essential: true,
      functional,
      analytics,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
    set({ consent: preferences, hasResponded: true, isPreferencesOpen: false });
  },

  openPreferences: () => set({ isPreferencesOpen: true }),
  closePreferences: () => set({ isPreferencesOpen: false }),
}));
