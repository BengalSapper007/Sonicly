import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ManageCookiesButton } from '@/components/legal/ManageCookiesButton';
import { Cookie, HardDrive, Shield, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie & Storage Policy',
  description: 'Understand how Sonicly uses cookies, local storage, and client caching to deliver audio streaming.',
  alternates: {
    canonical: '/cookies',
  },
};

export default function CookiesPage() {
  return (
    <div className="p-6 md:p-10 pb-28 max-w-4xl mx-auto min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cookie Policy' }]} />
      </div>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-sand">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-semibold uppercase tracking-wider mb-3">
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookies & Client Storage</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-3">
          Cookie & Storage Policy
        </h1>
        <p className="text-sm text-ink-muted">
          Last updated: September 18, 2026 • Details on cookies, localStorage, and IndexedDB caching.
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-ink/90">
        {/* Interactive Preferences Card */}
        <section className="bg-[#FAF7F0] border border-sand rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base font-bold font-serif text-ink">Your Current Consent Settings</h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              You have granular control over non-essential cookies and functional storage keys.
              You can adjust or revoke your preferences at any time.
            </p>
          </div>
          <ManageCookiesButton />
        </section>

        {/* Section 1: What we use */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <HardDrive className="w-5 h-5 text-saffron flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">1. What Technologies We Use</h2>
          </div>
          <p>
            Unlike traditional web applications, modern audio streaming platforms like Sonicly rely on
            both <strong>HTTP cookies</strong> (for secure server communication) and <strong>client-side browser storage</strong> (localStorage and IndexedDB) to ensure high-fidelity audio doesn’t stutter or drop frames.
          </p>
        </section>

        {/* Section 2: Breakdown Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <Shield className="w-5 h-5 text-forest flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">2. Breakdown of Storage Items</h2>
          </div>

          <div className="overflow-x-auto border border-sand rounded-2xl bg-[#FAF7F0]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-sand bg-sand/40 text-ink font-semibold">
                  <th className="p-3.5">Name / Key</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Lifespan</th>
                  <th className="p-3.5">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50 text-ink/80">
                <tr>
                  <td className="p-3.5 font-mono text-saffron font-semibold">sonicly_token</td>
                  <td className="p-3.5">HTTP Cookie</td>
                  <td className="p-3.5">Strictly Necessary</td>
                  <td className="p-3.5">Session / 7 Days</td>
                  <td className="p-3.5">Cryptographic session authentication token.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-saffron font-semibold">sonicly_cookie_consent</td>
                  <td className="p-3.5">localStorage</td>
                  <td className="p-3.5">Strictly Necessary</td>
                  <td className="p-3.5">Persistent (1 Year)</td>
                  <td className="p-3.5">Saves your cookie consent choices so the banner does not reappear.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-saffron font-semibold">sonicly-player-storage</td>
                  <td className="p-3.5">localStorage</td>
                  <td className="p-3.5">Functional</td>
                  <td className="p-3.5">Persistent</td>
                  <td className="p-3.5">Remembers playback volume, shuffle mode, repeat state, and queue history.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-saffron font-semibold">sonicly-sidebar-storage</td>
                  <td className="p-3.5">localStorage</td>
                  <td className="p-3.5">Functional</td>
                  <td className="p-3.5">Persistent</td>
                  <td className="p-3.5">Remembers whether the sidebar is collapsed and its dragged width.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-saffron font-semibold">sonicly_stream_cache</td>
                  <td className="p-3.5">IndexedDB</td>
                  <td className="p-3.5">Performance</td>
                  <td className="p-3.5">Temporary Cache</td>
                  <td className="p-3.5">Stores audio segments to allow instant seeking without re-downloading bytes.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: How to clear */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <CheckCircle2 className="w-5 h-5 text-indigo flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">3. Managing and Clearing Data</h2>
          </div>
          <p>
            You can clear or block cookies and local storage through your web browser settings at any
            time (e.g. Chrome, Firefox, Safari, Edge). Please note that clearing essential cookies will
            log you out of your Sonicly account and reset your playback queue.
          </p>
          <p>
            For more information on how we handle personal data, please visit our{' '}
            <Link href="/privacy" className="text-saffron font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
