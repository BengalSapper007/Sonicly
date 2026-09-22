'use client';
import { Settings2 } from 'lucide-react';
import { useCookieConsentStore } from '@/stores/cookie-consent.store';

export function ManageCookiesButton() {
  const openPreferences = useCookieConsentStore((s) => s.openPreferences);

  return (
    <button
      onClick={openPreferences}
      className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold cursor-pointer shadow-sm"
    >
      <Settings2 className="w-4 h-4" />
      <span>Manage Cookie Preferences</span>
    </button>
  );
}
