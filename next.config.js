/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // DO NOT use output: 'export' - it's incompatible with dynamic routes
  // The @cloudflare/next-on-pages adapter handles SSR on edge

  // Disable trailing slash for cleaner URLs
  trailingSlash: false,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
    // Unoptimized for edge deployment
    unoptimized: true,
  },

  // Enable experimental features
  experimental: {
    // Allow useSearchParams without Suspense boundary (falls back to CSR)
    missingSuspenseWithCSRBailout: false,
  },

  // Compiler options for production
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Environment variables to expose to the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
