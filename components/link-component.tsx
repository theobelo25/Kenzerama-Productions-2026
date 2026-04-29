"use client";
import type { ComponentProps } from "react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

        if (!withTransition) {
          return;
        }

        e.preventDefault();
        if (setOpen) setOpen(false);

        router.push(href, {
          onTransitionReady: pageAnimation,
        });
      }}
      className={cn("", className)}
      {...linkProps}
    >
      {children}
    </Link>
  );
};

const pageAnimation = () => {
  document.documentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 500,
    easing: "cubic-bezier(0.76, 0, 0.24, 1",
    pseudoElement: "::view-transition-old(root)",
  });

  document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 500,
    easing: "cubic-bezier(0.76, 0, 0.24, 1",
    pseudoElement: "::view-transition-new(root)",
  });
};

export default LinkComponent;
