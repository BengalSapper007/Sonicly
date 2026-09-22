'use client';
import { useState, useEffect } from 'react';
import { X, ShieldCheck, Sliders, BarChart2, Check } from 'lucide-react';
import { useCookieConsentStore } from '@/stores/cookie-consent.store';

export function CookiePreferencesModal() {
  const { consent, isPreferencesOpen, closePreferences, savePreferences, acceptAll } =
    useCookieConsentStore();

  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    if (consent) {
      setFunctional(consent.functional);
      setAnalytics(consent.analytics);
    }
  }, [consent, isPreferencesOpen]);

  if (!isPreferencesOpen) return null;

  const handleSave = () => {
    savePreferences({ functional, analytics });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF7F0] border border-sand rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-sand flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 id="cookie-modal-title" className="text-base font-semibold text-ink">
                Cookie & Storage Preferences
              </h3>
              <p className="text-xs text-ink-muted">Manage how Sonicly stores data in your browser</p>
            </div>
          </div>
          <button
            onClick={closePreferences}
            className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-sand/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-sand/60">
          {/* Essential */}
          <div className="pt-2 first:pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest" />
                  <h4 className="text-sm font-semibold text-ink">Strictly Necessary</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-forest/10 text-forest px-2 py-0.5 rounded-full">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Required for user authentication sessions, secure login verification, and seamless
                  audio buffer streaming. The app cannot function without these.
                </p>
              </div>
            </div>
          </div>

          {/* Functional */}
          <div className="pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-saffron" />
                  <h4 className="text-sm font-semibold text-ink">Functional & Preferences</h4>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Remembers your audio playback volume, repeat/shuffle toggles, sidebar width, and
                  cached player state across browser restarts.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-sand peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron"></div>
              </label>
            </div>
          </div>

          {/* Analytics */}
          <div className="pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo" />
                  <h4 className="text-sm font-semibold text-ink">Analytics & Performance</h4>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Helps us measure stream load latency, playback interruptions, and total song play
                  metrics without recording personally identifying information.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-sand peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-sand bg-white/60 flex items-center justify-between gap-3">
          <button
            onClick={acceptAll}
            className="text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer px-2 py-1.5"
          >
            Accept All
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={closePreferences}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-ink-muted hover:text-ink hover:bg-sand/50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
