import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the root to this directory. Without it Turbopack walks up and finds a
    // stray lockfile in the home directory and infers the wrong workspace root.
    root: path.join(__dirname),
  },
};

export default nextConfig;
