"use client";

import ErrorFallback from "@/components/layout/error-fallback";
import SiteFrame from "@/components/layout/site-frame";

type SiteErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
  mainClassName?: string;
  rootClassName?: string;
};

export default function SiteErrorPage({
  error,
  reset,
  mainClassName = "pt-[76px]",
  rootClassName,
}: SiteErrorPageProps) {
  return (
    <SiteFrame mainClassName={mainClassName} rootClassName={rootClassName}>
      <div className="flex flex-1 flex-col">
        <ErrorFallback error={error} reset={reset} />
      </div>
    </SiteFrame>
  );
}
