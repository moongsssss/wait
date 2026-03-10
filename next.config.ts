import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/wait',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;