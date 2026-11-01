import type { NextConfig } from "next";

/* Static export: `next build` writes plain HTML/CSS/JS to out/, which
   scripts/publish.mjs copies to the repository root for Cloudflare Pages. */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  turbopack: {
    rules: {
      // Tailwind CSS v4 runs as a Turbopack loader.
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
