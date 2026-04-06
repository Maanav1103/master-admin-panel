import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d151e5y2tphsnj.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
