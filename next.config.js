/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['cloud.appwrite.io'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Environment variable configuration
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },

  // Compression
  compress: true,

  // ESLint configuration for production
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during production builds
  },

  // TypeScript configuration for production
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during production builds
  },
};

module.exports = nextConfig;