import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project so Turbopack doesn't get
    // confused by unrelated lockfiles elsewhere on disk (e.g. in $HOME).
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
