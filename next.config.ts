import type { NextConfig } from "next";

const isGithubPagesDeploy = process.env.GITHUB_PAGES_DEPLOY === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages인 경우에만 저장소 이름 경로 적용
  basePath: isGithubPagesDeploy ? '/wait' : undefined,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
