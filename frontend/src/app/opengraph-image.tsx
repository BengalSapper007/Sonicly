import { ImageResponse } from 'next/og';

export const alt = 'Sonicly — High-Fidelity Music Streaming';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#12192F',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#E2720A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '40px',
              fontWeight: 'bold',
            }}
          >
            S
          </div>
          <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-0.03em' }}>
            Sonicly
          </span>
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '54px',
              fontWeight: 800,
              color: '#F6F1E4',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              maxWidth: '960px',
            }}
          >
            High-Fidelity Music Streaming Built for Sound Enthusiasts
          </div>
          <div style={{ fontSize: '24px', color: '#B3C0D8' }}>
            Stream lossless master audio, explore curated discographies, and follow independent artists.
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: 'rgba(226, 114, 10, 0.2)',
              border: '2px solid #E2720A',
              borderRadius: '999px',
              padding: '10px 24px',
              color: '#E2720A',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            sonicly.fm
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              padding: '10px 24px',
              color: '#F6F1E4',
              fontSize: '18px',
            }}
          >
            Curated Playlists & Discographies
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
