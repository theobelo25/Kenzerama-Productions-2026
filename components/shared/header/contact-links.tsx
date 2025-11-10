import Link from "next/link";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

const ContactLinks = () => {
  return (
    <>
      <h2 className="text-normal text-kenzeramaPink">Reach out to us!</h2>
      <div className="flex space-x-5 pl-4">
        <Link href="/insta">
          <Instagram />
        </Link>
        <Link href="/you">
          <Youtube />
        </Link>
        <Link href="/mail">
          <Mail />
        </Link>
        <Link href="/phone">
          <Phone />
        </Link>
      </div>
    </>
  );
};

export default ContactLinks;
