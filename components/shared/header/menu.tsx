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

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full gap-1">
        <PageLinks />
      </nav>
      <nav className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="align-middle"
            aria-label="Open Menu"
            style={{ cursor: "pointer" }}
          >
            <EllipsisVertical className="hover:text-kenzerama-pink" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-12">
            <SheetTitle className="text-kenzerama-pink font-cinzel font-normal">
              <LinkComponent href="/" setOpen={setOpen}>
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
      </nav>
    </div>
  );
};

export default Menu;
