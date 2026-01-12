import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { StoreProvider } from '@/components/providers/StoreProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0c18',
};

export const metadata: Metadata = {
  title: {
    template: '%s | Hindi Confession',
    default: 'Hindi Confession - Anonymous Confessions in Hindi',
  },
  description: 'Share your deepest confessions anonymously in Hindi. A safe space for Hindi-speaking adults (18+) to share secrets, stories, and experiences.',
  keywords: [
    'hindi confession',
    'anonymous confession',
    'hindi stories',
    'adult confession',
    'secret sharing',
    'confession platform',
    'anonymous stories',
    'hindi adult',
  ],
  authors: [{ name: 'Hindi Confession' }],
  creator: 'Hindi Confession',
  publisher: 'Hindi Confession',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: ['en_US', 'pa_IN'],
    siteName: 'Hindi Confession',
    title: 'Hindi Confession - Anonymous Confessions in Hindi',
    description: 'Share your deepest confessions anonymously in Hindi. A safe space for Hindi-speaking adults.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hindi Confession',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hindi Confession',
    description: 'Share your deepest confessions anonymously in Hindi.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification tokens when ready
    // google: 'verification-token',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        {/* Google Fonts for Hindi and Punjabi */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gurmukhi:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-950 text-dark-100 antialiased min-h-screen">
        <StoreProvider>
          {children}
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
