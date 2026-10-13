import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a second dev server or a local production build use its own output
  // folder (NEXT_DIST_DIR=.next-preview) without clobbering a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
