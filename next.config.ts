import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next.js detects a
  // stray ~/package-lock.json (unrelated 2018 cruft) and mis-infers the root.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
