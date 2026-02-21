import type { NextConfig } from "next";
import { join } from 'node:path';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@nexbe/nexbi', '@nexbe/icons'],
  outputFileTracingRoot: join(process.cwd(), '..'),
  turbopack: {
    root: join(process.cwd(), '..'),
  },
};

export default nextConfig;
