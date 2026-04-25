import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const basePath = process.env.NODE_ENV === "production" ? "/wp-blog-app" : "";

const nextConfig: NextConfig = {
  // Parent folder has its own package-lock.json; pin Turbopack root to this app.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
