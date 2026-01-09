import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Ensure external packages work in server components
  serverExternalPackages: ['@fal-ai/client'],
};

export default nextConfig;
