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
        <Link href="/insta w-fit h-fit">
          <span className="sr-only">Instagram</span>
          <Instagram size={iconSize} />
        </Link>
      </Button>
      <Button
        asChild
        variant={"ghost"}
        className="hover:text-kenzerama-pink p-4 [--spacing:1]"
      >
        <Link href="/you">
          <span className="sr-only">Youtube</span>
          <Youtube size={iconSize} />
        </Link>
      </Button>
      <Button
        asChild
        variant={"ghost"}
        className="hover:text-kenzerama-pink p-4 [--spacing:1]"
      >
        <Link href="/mail">
          <span className="sr-only">Mail</span>
          <Mail size={iconSize} />
        </Link>
      </Button>
      <Button
        asChild
        variant={"ghost"}
        className="hover:text-kenzerama-pink [--spacing:1]"
      >
        <Link href="/phone" className="pt-4">
          <span className="sr-only">Phone</span>
          <Phone size={iconSize} />
        </Link>
      </Button>
    </div>
  );
};

export default ContactLinks;
