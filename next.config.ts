import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail build on TypeScript errors in development
    ignoreBuildErrors: false,
  },
  experimental: {
    // Enable some experimental features for better performance
    optimizePackageImports: ['lucide-react'],
  },
  // Image optimization
  images: {
    domains: ['cloud.appwrite.io'], // Add Appwrite domain for images
  },
};

export default nextConfig;
