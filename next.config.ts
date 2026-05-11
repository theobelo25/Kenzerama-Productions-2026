import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function patternKey(p: RemotePattern): string {
  const port = "port" in p && p.port ? String(p.port) : "";
  return `${p.protocol}:${p.hostname}:${port}`;
}

/** Parse Directus base URL(s) into `remotePatterns` for the image optimizer. */
function directusImageRemotePatterns(): RemotePattern[] {
  const raws = [
    process.env.NEXT_PUBLIC_DIRECTUS_URL,
    process.env.DIRECTUS_URL,
    /** Optional extra origin(s) only for image allowlist (e.g. internal Docker URL at build time). */
    process.env.DIRECTUS_IMAGE_ORIGIN,
  ].filter((s): s is string => Boolean(s?.trim()));

  const patterns: RemotePattern[] = [];
  const seen = new Set<string>();

  for (const raw of raws) {
    try {
      const u = new URL(raw.trim());
      const protocol = (u.protocol.replace(":", "") || "https") as
        | "http"
        | "https";
      const entry: RemotePattern = {
        protocol,
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: "/assets/**",
      };
      const key = patternKey(entry);
      if (seen.has(key)) continue;
      seen.add(key);
      patterns.push(entry);
    } catch {
      /* ignore */
    }
  }

  return patterns;
}

/**
 * Safety fallbacks so `next/image` keeps working when env differs between
 * build/runtime (container hostnames vs local browser hostnames).
 */
function directusHostFallbacks(): RemotePattern[] {
  return [
    {
      protocol: "http",
      hostname: "directus",
      port: "8055",
      pathname: "/assets/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "8055",
      pathname: "/assets/**",
    },
  ];
}

function mergeImageRemotePatterns(base: RemotePattern[]): RemotePattern[] {
  const seen = new Set<string>();
  const out: RemotePattern[] = [];
  for (const p of base) {
    const key = patternKey(p);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/our-videographers",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/our-team",
        destination: "/about-us",
        permanent: true,
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote", "next-video"],
  images: {
    // Docker service hostnames (e.g. `directus`) resolve to private bridge IPs.
    // Allow Next Image optimizer to fetch those internal origins.
    dangerouslyAllowLocalIP: true,
    qualities: [40, 45, 60, 70, 75, 95],
    remotePatterns: mergeImageRemotePatterns([
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      ...directusImageRemotePatterns(),
      ...directusHostFallbacks(),
    ]),
  },
  experimental: {
    esmExternals: true, // prefer native ESM deps
    inlineCss: true,
    mdxRs: true,
    viewTransition: true,
  },
};

const withMDX = createMDX({});

export default withBundleAnalyzer(withNextVideo(withMDX(nextConfig)));
