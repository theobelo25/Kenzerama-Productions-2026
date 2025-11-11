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

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full gap-1">
        <PageLinks />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger
            className="align-middle"
            aria-label="Open Menu"
            style={{ cursor: "pointer" }}
          >
            <EllipsisVertical className="hover:text-kenzeramaPink" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-12">
            <SheetTitle className="text-kenzeramaPink font-cinzel font-normal">
              Kenzerama Productions
            </SheetTitle>
            <SheetDescription></SheetDescription>
            <PageLinks />
            <ContactLinks />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
