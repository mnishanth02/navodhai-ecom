import type { NextConfig } from "next";

const nextConfig: NextConfig = {
reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-4d2173af25e142eca43ad363e8e558e9.r2.dev',
        port: '',
        pathname: '/examples/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
};

export default nextConfig;
