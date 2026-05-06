"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type BlogMainProps = {
  children: React.ReactNode;
};

const BlogMain = ({ children }: BlogMainProps) => {
  const pathname = usePathname();
  const isFilmPage = pathname.includes("/films/");

  return (
    <div className={cn(isFilmPage ? "pt-17 md:pt-19" : "pt-45 md:pt-31.5")}>
      {children}
    </div>
  );
};

export default BlogMain;
