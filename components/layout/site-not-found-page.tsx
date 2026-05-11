"use client";

import NotFoundFallback from "@/components/layout/not-found-fallback";
import SiteFrame from "@/components/layout/site-frame";

type SiteNotFoundPageProps = {
  mainClassName?: string;
  rootClassName?: string;
};

export default function SiteNotFoundPage({
  mainClassName = "pt-[76px]",
  rootClassName,
}: SiteNotFoundPageProps = {}) {
  return (
    <SiteFrame mainClassName={mainClassName} rootClassName={rootClassName}>
      <div className="flex flex-1 flex-col">
        <NotFoundFallback />
      </div>
    </SiteFrame>
  );
}
