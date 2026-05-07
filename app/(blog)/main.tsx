"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type BlogMainProps = {
  children: React.ReactNode;
};

const FILM_DETAIL_PATH = /^\/blog\/films\/[^/]+\/?$/;

const BlogMain = ({ children }: BlogMainProps) => {
  const pathname = usePathname();
  /** Film detail top offset lives in `films/[name]/layout.tsx` so it matches the server tree during loading. */
  const isFilmDetail = FILM_DETAIL_PATH.test(pathname);

  return (
    <div className={cn(!isFilmDetail && "pt-45 md:pt-31.5")}>
      {children}
    </div>
  );
};

export default BlogMain;
