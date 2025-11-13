import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

const ContactLinks = () => {
  return (
    <>
      <h2 className="text-normal text-kenzerama-pink">Reach out to us!</h2>
      <div className="flex space-x-5 pl-1">
        <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
          <Link href="/insta">
            <Instagram />
          </Link>
        </Button>
        <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
          <Link href="/you">
            <Youtube />
          </Link>
        </Button>
        <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
          <Link href="/mail">
            <Mail />
          </Link>
        </Button>
        <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
          <Link href="/phone">
            <Phone />
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ContactLinks;
