"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PageLinks from "./page-links";
import ContactLinks from "./contact-links";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import LinkComponent from "@/components/link-component";
import { usePathname } from "next/navigation";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex justify-end gap-3">
      <div className="max-md:hidden md:relative md:w-fit md:shrink-0">
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl border border-white/10 bg-black/40 shadow-md shadow-black/20 backdrop-blur-md [transform:translate3d(0,0,0)]"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-9 items-center gap-1 px-2.5 py-1.5 lg:px-3">
          <PageLinks />
        </div>
      </div>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="align-middle rounded-full border border-white/10 bg-black/40 p-1.5 shadow-md shadow-black/20 backdrop-blur-md transition hover:bg-black/50"
            aria-label="Open Menu"
            style={{ cursor: "pointer" }}
          >
            <EllipsisVertical className="hover:text-kenzerama-pink" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start border-l-0 bg-white/20 p-12 text-white shadow-2xl shadow-black/25 backdrop-blur-xl">
            <SheetTitle
              className={
                isLandingPage
                  ? "sr-only"
                  : "text-kenzerama-pink font-cinzel font-normal"
              }
            >
              <LinkComponent href="/" setOpen={setOpen} withTransition>
                Kenzerama Productions
              </LinkComponent>
            </SheetTitle>
            <SheetDescription></SheetDescription>
            <PageLinks setOpen={setOpen} />
            <h2 className="text-normal text-kenzerama-pink">
              Reach out to us!
            </h2>
            <ContactLinks iconSize={16} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Menu;
