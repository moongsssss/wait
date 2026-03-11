import type { NextConfig } from "next";

const isGithubPagesDeploy = process.env.GITHUB_PAGES_DEPLOY === 'true';

let assetPrefix = '';
let basePath = '';

if (isGithubPagesDeploy && process.env.GITHUB_REPOSITORY) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: assetPrefix || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
