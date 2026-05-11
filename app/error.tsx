"use client";

import SiteErrorPage from "@/components/layout/site-error-page";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <SiteErrorPage error={error} reset={reset} />;
}
