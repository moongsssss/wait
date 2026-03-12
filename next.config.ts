import type { NextConfig } from "next";

const isGithubPagesDeploy = process.env.GITHUB_PAGES_DEPLOY === 'true';

let assetPrefix = undefined;
let basePath = undefined;

if (isGithubPagesDeploy && process.env.GITHUB_REPOSITORY) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
