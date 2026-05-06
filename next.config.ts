import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/our-videographers",
        destination: "/our-team",
        permanent: true,
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote", "next-video"],
  images: {
    qualities: [40, 45, 60, 75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "**",
      },
    ],
  },
  experimental: {
    esmExternals: true, // prefer native ESM deps
    inlineCss: true,
    mdxRs: true,
    viewTransition: true,
  },
};

const withMDX = createMDX({});

export default withNextVideo(withMDX(nextConfig));
