"use client";

import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";

type SiteFrameProps = {
  children: React.ReactNode;
  mainClassName?: string;
  rootClassName?: string;
};

export default function SiteFrame({
  children,
  mainClassName,
  rootClassName,
}: SiteFrameProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", rootClassName)}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        className={cn("flex flex-1 flex-col", mainClassName)}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
