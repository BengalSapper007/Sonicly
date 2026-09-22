'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Settings2 } from 'lucide-react';
import { useCookieConsentStore } from '@/stores/cookie-consent.store';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export function CookieConsentBanner() {
  const { hasResponded, initConsent, acceptAll, acceptEssential, openPreferences } =
    useCookieConsentStore();

  useEffect(() => {
    initConsent();
  }, [initConsent]);

  return (
    <>
      <CookiePreferencesModal />

      {!hasResponded && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-20 md:bottom-24 right-4 md:right-8 z-[80] max-w-md w-[calc(100vw-2rem)] bg-[#FAF7F0]/95 backdrop-blur-md border border-sand shadow-2xl rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-ink mb-1">We respect your privacy</h4>
              <p className="text-xs text-ink-muted leading-relaxed mb-3">
                Sonicly uses cookies and local storage for authentication, seamless audio streaming,
                and remembering your playback settings. Read our{' '}
                <Link
                  href="/cookies"
                  className="text-saffron hover:underline font-medium"
                >
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-saffron hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={acceptAll}
                  className="btn-primary text-xs px-3.5 py-1.5 cursor-pointer shadow-xs font-semibold"
                >
                  Accept All
                </button>
                <button
                  onClick={acceptEssential}
                  className="px-3 py-1.5 rounded-lg border border-sand bg-white/70 hover:bg-white text-xs font-semibold text-ink transition-colors cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  onClick={openPreferences}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-muted hover:text-ink hover:bg-sand/50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Customize cookie preferences"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
