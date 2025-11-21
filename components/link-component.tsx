"use client";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LinkComponent = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useTransitionRouter();

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        console.log("click");
        router.push(href, {
          onTransitionReady: pageAnimation,
        });
      }}
      className={cn("", className)}
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
