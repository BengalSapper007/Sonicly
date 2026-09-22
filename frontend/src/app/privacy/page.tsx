import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShieldCheck, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Sonicly collects, uses, and safeguards your data and listening history.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="p-6 md:p-10 pb-28 max-w-4xl mx-auto min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      </div>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-sand">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-ink-muted">
          Last updated: September 18, 2026 • Effective immediately for all users.
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-ink/90">
        {/* Section 1 */}
        <section className="bg-[#FAF7F0] border border-sand rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 text-ink">
            <Eye className="w-5 h-5 text-saffron flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">1. Overview & Commitment</h2>
          </div>
          <p>
            At <strong>Sonicly</strong>, we believe that an exceptional listening experience starts with
            respect for your personal data. We are committed to transparency in what we collect, how
            your stream history is used, and how you maintain complete ownership over your account.
          </p>
          <p>
            This Privacy Policy applies to all services provided by Sonicly, including our web
            application, streaming audio infrastructure, and user account portal.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <Database className="w-5 h-5 text-saffron flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">2. Information We Collect</h2>
          </div>
          <p>
            To deliver smooth audio playback, organize your library, and provide artist statistics, we
            collect the following categories of information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#FAF7F0] border border-sand p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-ink text-sm">Account Information</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                When you create an account, we collect your email address, username, and encrypted
                password hash. We never store plain-text credentials.
              </p>
            </div>

            <div className="bg-[#FAF7F0] border border-sand p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-ink text-sm">Listening & Stream Activity</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                We record song streams, playback progress, liked tracks, created playlists, and followed
                artists to calculate genuine play counts and distinct artist listeners.
              </p>
            </div>

            <div className="bg-[#FAF7F0] border border-sand p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-ink text-sm">Client Storage & Preferences</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                We store your volume settings, shuffle/repeat preferences, and offline audio buffers
                in your browser using localStorage and IndexedDB.
              </p>
            </div>

            <div className="bg-[#FAF7F0] border border-sand p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-ink text-sm">Technical Diagnostics</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Anonymous diagnostic headers (browser version, OS, playback error reports) to diagnose
                audio delivery issues and optimize streaming bitrates.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <Lock className="w-5 h-5 text-forest flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">3. How We Use Your Data</h2>
          </div>
          <p>We use your information exclusively to provide and enhance the Sonicly music experience:</p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-ink-muted">
            <li>
              <strong className="text-ink">Delivering Audio Streams:</strong> Buffering, chunking, and caching high-fidelity audio streams for your device.
            </li>
            <li>
              <strong className="text-ink">Real-time Platform Metrics:</strong> Aggregating verified song play counts and calculating authentic unique listener totals for artists without selling user data.
            </li>
            <li>
              <strong className="text-ink">Personalized Library:</strong> Synchronizing your liked songs, custom playlists, and followed artists across your sessions.
            </li>
            <li>
              <strong className="text-ink">Account Security:</strong> Generating and validating cryptographically signed session tokens.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <UserCheck className="w-5 h-5 text-indigo flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">4. Your Rights (GDPR & CCPA Compliance)</h2>
          </div>
          <p>
            Regardless of where you reside, Sonicly provides comprehensive controls over your
            personal data:
          </p>

          <div className="bg-[#FAF7F0] border border-sand rounded-xl p-5 space-y-3">
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>
                <strong className="text-ink">Right to Access & Portability:</strong> You can request a complete copy of your listening history and account profile at any time.
              </li>
              <li>
                <strong className="text-ink">Right to Erasure (Deletion):</strong> You have the right to request full deletion of your account and all associated listening history from our PostgreSQL database.
              </li>
              <li>
                <strong className="text-ink">Right to Withdraw Consent:</strong> You can adjust or revoke your cookie and local storage preferences at any time via our{' '}
                <Link href="/cookies" className="text-saffron font-medium hover:underline">
                  Cookie Policy
                </Link>
                .
              </li>
              <li>
                <strong className="text-ink">No Sale of Personal Data:</strong> Sonicly does not sell, rent, or trade your personal information or listening habits to advertisers or data brokers.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <Mail className="w-5 h-5 text-saffron flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">5. Contact & Data Inquiries</h2>
          </div>
          <p>
            If you have questions regarding this Privacy Policy or wish to exercise your data rights,
            please contact our privacy team:
          </p>
          <div className="p-4 bg-sand/30 border border-sand rounded-xl text-xs space-y-1">
            <p className="font-semibold text-ink">Sonicly Privacy & Data Protection</p>
            <p className="text-ink-muted">Email: privacy@sonicly.audio</p>
            <p className="text-ink-muted">Address: Sonicly Music Inc., Engineering & Compliance Division</p>
          </div>
        </section>
      </div>
    </div>
  );
}
