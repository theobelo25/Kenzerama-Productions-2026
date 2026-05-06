"use client";
import type { ComponentProps } from "react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TRANSITION_START_EVENT = "kp:route-transition-start";

const LinkComponent = ({
  href,
  children,
  className,
  setOpen,
  withTransition = false,
  onClick,
  ...linkProps
}: Omit<ComponentProps<typeof Link>, "className"> & {
  href: string;
  children: React.ReactNode;
  className?: string;
  setOpen?: (open: boolean) => void;
  withTransition?: boolean;
}) => {
  const router = useTransitionRouter();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        const isModifiedClick =
          e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
        const target = e.currentTarget.getAttribute("target");
        const opensNewBrowsingContext = target && target !== "_self";
        const isDownloadLink = e.currentTarget.hasAttribute("download");

        if (isModifiedClick || opensNewBrowsingContext || isDownloadLink) {
          return;
        }

        if (setOpen) setOpen(false);

        if (!withTransition) {
          return;
        }

        e.preventDefault();
        window.dispatchEvent(new Event(TRANSITION_START_EVENT));
        router.push(href);
      }}
      className={cn("", className)}
      {...linkProps}
    >
      {children}
    </Link>
  );
};

export default LinkComponent;
