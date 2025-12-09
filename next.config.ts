import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "scontent-phx1-1.cdninstagram.com",
        pathname: "**",
      },
    ],
  },
  experimental: {
    esmExternals: true, // prefer native ESM deps
    turbopackRemoveUnusedExports: true,
    inlineCss: true,
    mdxRs: true,
    viewTransition: true,
  },
};

const withMDX = createMDX({});

export default withMDX(withNextVideo(nextConfig));
