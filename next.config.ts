import type { NextConfig } from "next";

const isGithubPagesDeploy = process.env.GITHUB_PAGES_DEPLOY === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages인 경우에만 저장소 이름 경로 적용, 그 외(Cloudflare 등)는 루트(/) 사용
  basePath: isGithubPagesDeploy ? '/wait' : undefined,
  assetPrefix: isGithubPagesDeploy ? '/wait/' : undefined,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
