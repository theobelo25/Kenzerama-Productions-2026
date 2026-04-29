"use client";

import LinkComponent from "@/components/link-component";
import { HERO_CTA_LINK_CLASSNAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type HeroCtaLinkProps = Omit<
  ComponentProps<typeof LinkComponent>,
  "className"
> & {
  className?: string;
  /** Use inside a `pointer-events-none` ancestor so the link stays clickable (e.g. hero title). */
  pointerEventsAuto?: boolean;
};

export default function HeroCtaLink({
  className,
  pointerEventsAuto,
  withTransition = true,
  ...props
}: HeroCtaLinkProps) {
  return (
    <LinkComponent
      withTransition={withTransition}
      className={cn(
        HERO_CTA_LINK_CLASSNAME,
        pointerEventsAuto && "pointer-events-auto",
        className,
      )}
      {...props}
    />
  );
}
