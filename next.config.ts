import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dodgerblue-monkey-417412.hostingersite.com',
        port: '',
        pathname: '/storage/products/**',
      },
    ],
  },
};

export default nextConfig;
