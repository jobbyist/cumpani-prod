import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',           // Required for static export to GitHub Pages
  trailingSlash: true,        // Helps with GitHub Pages routing
  images: {
    unoptimized: true,      // Required for static export
  },
  // If deploying to a subdirectory (not needed for custom domain root), uncomment:
  // basePath: '/cumpani-prod',
  // assetPrefix: '/cumpani-prod/',
};

export default nextConfig;
