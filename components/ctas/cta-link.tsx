"use client";

import LinkComponent from "@/components/navigation/link-component";
import { SECTION_CTA_LINK_CLASSNAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type CtaLinkProps = Omit<
  ComponentProps<typeof LinkComponent>,
  "className"
> & {
  className?: string;
};

export default function CtaLink({
  className,
  withTransition = true,
  ...props
}: CtaLinkProps) {
  return (
    <LinkComponent
      withTransition={withTransition}
      className={cn(SECTION_CTA_LINK_CLASSNAME, className)}
      {...props}
    />
  );
}
