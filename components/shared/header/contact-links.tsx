import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const ContactLinks = ({
  className,
  buttonClassName,
  iconSize = 16,
}: {
  className?: string;
  buttonClassName?: string;
  iconSize: number;
}) => {
  const baseButtonClassName =
    "border-transparent bg-transparent shadow-none backdrop-blur-none hover:bg-transparent hover:text-kenzerama-pink [--spacing:1]";

  return (
    <div className={cn("flex gap-8 pl-1", className)}>
      <Button
        asChild
        variant={"ghost"}
        className={cn(baseButtonClassName, "p-4", buttonClassName)}
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
        className="border-transparent bg-transparent shadow-none backdrop-blur-none hover:bg-transparent hover:text-kenzerama-pink p-4 [--spacing:1]"
      >
        <a href="/you" target="_blank" rel="noopener noreferrer">
          <span className="sr-only">Youtube</span>
          <Youtube size={iconSize} />
        </a>
      </Button> */}
      <Button
        asChild
        variant={"ghost"}
        className={cn(baseButtonClassName, "p-4", buttonClassName)}
      >
        <a href="mailto:mackenzie@kenzeramaproductions.com">
          <span className="sr-only">Mail</span>
          <Mail size={iconSize} />
        </a>
      </Button>
      <Button
        asChild
        variant={"ghost"}
        className={cn(baseButtonClassName, buttonClassName)}
      >
        <a href="tel:14166060379" className="pt-4">
          <span className="sr-only">Phone</span>
          <Phone size={iconSize} />
        </a>
      </Button>
    </div>
  );
};

export default ContactLinks;
