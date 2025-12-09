import { Button } from "@/components/ui/button";
import Link from "@/components/link-component";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const ContactLinks = ({
  className,
  iconSize = 16,
}: {
  className?: string;
  iconSize: number;
}) => {
  return (
    <div className={cn("flex gap-8 pl-1", className)}>
      <Button
        asChild
        variant={"ghost"}
        className="hover:text-kenzerama-pink p-4 [--spacing:1]"
      >
        <a
          href="https://www.instagram.com/kenzerama_productions/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="sr-only">Instagram</span>
          <Instagram size={iconSize} />
        </a>
      </Button>
      {/* <Button
        asChild
        variant={"ghost"}
        className="hover:text-kenzerama-pink p-4 [--spacing:1]"
      >
        <a href="/you" target="_blank" rel="noopener noreferrer">
          <span className="sr-only">Youtube</span>
          <Youtube size={iconSize} />
        </a>
      </Button> */}
      <Button
        asChild
        variant={"ghost"}
        className="hover:text-kenzerama-pink p-4 [--spacing:1]"
      >
        <a href="mailto:mackenzie@kenzeramaproductions.com">
          <span className="sr-only">Mail</span>
          <Mail size={iconSize} />
        </a>
      </Button>
      <Button
        asChild
        variant={"ghost"}
        className="hover:text-kenzerama-pink [--spacing:1]"
      >
        <Link href="tel:14166060379" className="pt-4">
          <span className="sr-only">Phone</span>
          <Phone size={iconSize} />
        </Link>
      </Button>
    </div>
  );
};

export default ContactLinks;
