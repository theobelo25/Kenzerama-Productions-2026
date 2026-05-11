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
import { Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import LinkComponent from "@/components/navigation/link-component";
import { usePathname } from "next/navigation";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex justify-end gap-3">
      <div className="max-md:hidden flex min-h-9 items-center gap-1 lg:gap-1.5">
        <PageLinks />
      </div>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="align-middle rounded-full border border-kenzerama-pink bg-black/40 p-1.5 shadow-md shadow-black/20 backdrop-blur-md transition hover:bg-black/50"
            aria-label="Open Menu"
            style={{ cursor: "pointer" }}
          >
            <MenuIcon
              className="size-5 text-white hover:text-kenzerama-pink"
              strokeWidth={2}
              aria-hidden
            />
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
