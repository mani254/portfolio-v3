import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["sanity-lib"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
