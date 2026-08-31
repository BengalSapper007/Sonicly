import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '$)$ — Sonicly',
  description: 'This track doesn\'t exist in our catalog.',
};

export default function NotFound() {
  return (
    <div className="relative min-h-full flex flex-col items-center justify-center overflow-hidden select-none">

      {/* ── Ambient glow blobs ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(208,188,255,0.1) 0%, transparent 60%)' }}
      />
      <div
        className="pointer-events-none absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #ffb0cd 0%, transparent 70%)', top: '20%', left: '60%' }}
      />
      <div
        className="pointer-events-none absolute w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #4cd7f6 0%, transparent 70%)', top: '50%', left: '10%' }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">

        {/* The gimmick — $)$ rendered as giant display text */}
        <div className="relative">
          {/* Blurred echo layer for glow depth */}
          <p
            aria-hidden="true"
            className="font-display font-black absolute inset-0 blur-2xl opacity-40 text-gradient-brand"
            style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
          >
            $)$
          </p>
          <p
            className="font-display font-black text-gradient-brand relative"
            style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
          >
            $)$
          </p>
        </div>

        {/* Subtext */}
        <div className="flex flex-col items-center gap-2 -mt-2">
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">
            Track not found
          </h1>
          <p className="text-sm max-w-xs" style={{ color: '#958ea0' }}>
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
                background: 'linear-gradient(to top, #d0bcff, #ffb0cd)',
                animation: `equalizer 1.1s ease-in-out ${delay * 0.4}s infinite`,
                height: `${12 + i % 3 * 6}px`,
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #a078ff 0%, #ffb0cd 100%)',
              boxShadow: '0 0 20px rgba(208,188,255,0.25)',
            }}
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(42,42,45,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#cbc3d7',
            }}
          >
            Search music
          </Link>
        </div>
      </div>
    </div>
  );
}
