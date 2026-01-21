import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote", "next-video"],
  images: {
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

export default withMDX(withNextVideo(nextConfig));
