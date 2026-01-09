import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (for Next.js 16+)
  turbopack: {},
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3b.fal.media',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fbyaqybbkfywfhgpjqwb.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
