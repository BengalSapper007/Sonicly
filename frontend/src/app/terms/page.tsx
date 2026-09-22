import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FileText, Music, Copyright, AlertTriangle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Review the Terms of Service governing your use of Sonicly streaming platform.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="p-6 md:p-10 pb-28 max-w-4xl mx-auto min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} />
      </div>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-sand">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-semibold uppercase tracking-wider mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-ink-muted">
          Last updated: September 18, 2026 • Please review these terms carefully before using Sonicly.
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-ink/90">
        {/* Section 1 */}
        <section className="bg-[#FAF7F0] border border-sand rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 text-ink">
            <Scale className="w-5 h-5 text-saffron flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">1. Acceptance of Terms</h2>
          </div>
          <p>
            Welcome to <strong>Sonicly</strong>. By accessing our web application, registering an account,
            or streaming music through our services, you agree to be bound by these Terms of Service
            (&ldquo;Terms&rdquo;) and our{' '}
            <Link href="/privacy" className="text-saffron font-medium hover:underline">
              Privacy Policy
            </Link>
            . If you do not agree to these terms, you must not use the service.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <Music className="w-5 h-5 text-saffron flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">2. Streaming License & Usage Rights</h2>
          </div>
          <p>
            Sonicly grants you a personal, non-exclusive, non-transferable, revocable license to stream
            audio tracks and view album and artist metadata strictly for your personal, non-commercial
            enjoyment.
          </p>
          <div className="bg-[#FAF7F0] border border-sand rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-ink text-sm">Prohibited Activities</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              You agree that you will not:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-ink-muted pl-2">
              <li>Rip, download, capture, record, or redistribute stream segments or raw audio files.</li>
              <li>Use automated bots, scripts, or scrapers to artificially inflate song play counts or listener metrics.</li>
              <li>Circumvent or tamper with audio digital rights, authorization headers, or access limits.</li>
              <li>Reverse engineer or decompile any portion of the Sonicly player or backend APIs.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <Copyright className="w-5 h-5 text-forest flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">3. Intellectual Property & DMCA Copyright</h2>
          </div>
          <p>
            All sound recordings, compositions, album artworks, artist biographies, and trademarks
            displayed on Sonicly are the intellectual property of their respective copyright holders
            and artists.
          </p>
          <div className="p-4 bg-sand/30 border border-sand rounded-xl text-xs space-y-2">
            <p className="font-semibold text-ink">DMCA Notice & Takedown Procedure</p>
            <p className="text-ink-muted leading-relaxed">
              If you believe that any audio or content hosted on Sonicly infringes upon your copyright,
              please submit a takedown notification to{' '}
              <span className="font-mono text-ink">dmca@sonicly.audio</span> containing the specific
              track URLs, proof of ownership, and physical or electronic signature.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-ink">
            <AlertTriangle className="w-5 h-5 text-saffron flex-shrink-0" />
            <h2 className="text-lg font-bold font-serif">4. Service Availability & Disclaimers</h2>
          </div>
          <p>
            Sonicly provides the service on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis.
            While we strive for high-fidelity, 99.9% uptime streaming, we make no warranties regarding
            uninterrupted service, audio buffer latencies across varying network conditions, or
            third-party CDN availability.
          </p>
          <p>
            Sonicly reserves the right to modify, suspend, or discontinue any feature, playlist, or track
            at any time without prior notice.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-ink">5. Account Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice, if you breach
            these Terms (including attempting to scrape audio or spoof play metrics). You may also close
            your account at any time by contacting support.
          </p>
        </section>
      </div>
    </div>
  );
}
