import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 | Sonicly',
  description: 'This track doesn\'t exist in our catalog.',
};

export default function NotFound() {
  return (
    <div className="relative min-h-full flex flex-col items-center justify-center overflow-hidden select-none" style={{ background: '#F6F1E4' }}>

      {/* ── Ambient glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(232,114,12,0.08) 0%, transparent 60%)' }}
      />
      <div
        className="pointer-events-none absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #0F6B45 0%, transparent 70%)', top: '20%', left: '60%' }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">

        <p
          className="font-display font-bold text-vibrant-saffron"
          style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
        >
          404
        </p>

        {/* Subtext */}
        <div className="flex flex-col items-center gap-2 -mt-2">
          <h1 className="font-display font-bold text-2xl text-on-surface tracking-tight">
            Track not found
          </h1>
          <p className="text-sm max-w-xs text-on-surface-muted">
            Looks like this page skipped the queue. It doesn&apos;t exist in our catalog — or it never did.
          </p>
        </div>

        {/* Equalizer bars — decorative animation */}
        <div className="flex items-end gap-1 h-6 my-1" aria-hidden="true">
          {[0.6, 0.9, 0.4, 1, 0.7, 0.5, 0.85, 0.35, 0.75].map((delay, i) => (
            <span
              key={i}
              className="w-1 rounded-full"
              style={{
                background: 'linear-gradient(to top, #E2720A, #0F6B45)',
                animation: `equalizer 1.1s ease-in-out ${delay * 0.4}s infinite`,
                height: `${12 + i % 3 * 6}px`,
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/search" className="btn-secondary">
            Search music
          </Link>
        </div>
      </div>
    </div>
  );
}
