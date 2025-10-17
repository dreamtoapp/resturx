import { ImageResponse } from 'next/og';

// Apple icon metadata (180x180 is recommended for iOS)
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Apple touch icon generation
export default async function AppleIcon() {
  // Safety-first: avoid fetching remote images during prerender to prevent build failures
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #2196f3, #1976d2)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '22px',
          textTransform: 'uppercase',
        }}
      >
        DTA
      </div>
    ),
    {
      ...size,
    }
  );
}
