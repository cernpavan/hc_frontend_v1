import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hindi Confession',
    short_name: 'Confession',
    description: 'Anonymous confessions in Hindi - A safe space for Hindi-speaking adults',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0c18',
    theme_color: '#d946ef',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
