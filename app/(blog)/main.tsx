"use client";

import { isFilmDetailPath } from "@/app/(blog)/film-detail-path";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type BlogMainProps = {
  children: React.ReactNode;
};

const BlogMain = ({ children }: BlogMainProps) => {
  const pathname = usePathname();
  /** Film detail top offset lives in `films/[name]/layout.tsx` so it matches the server tree during loading. */
  const isFilmDetail = isFilmDetailPath(pathname);

  return (
    <div className={cn("flex flex-1 flex-col", !isFilmDetail && "pt-45 md:pt-31.5")}>
      {children}
    </div>
  );
};

export default BlogMain;
