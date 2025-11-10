import { Button } from "@/components/ui/button";
import Link from "next/link";

const PageLinks = () => {
  return (
    <>
      <Button asChild variant={"ghost"}>
        <Link
          href="/our-team"
          className="font-questrial uppercase tracking-widest text-xs"
        >
          Our Team
        </Link>
      </Button>
      <Button asChild variant={"ghost"}>
        <Link
          href="/wedding-films"
          className="font-questrial uppercase tracking-widest text-xs"
        >
          Wedding Films
        </Link>
      </Button>
      <Button asChild variant={"ghost"}>
        <Link
          href="/investment"
          className="font-questrial uppercase tracking-widest text-xs"
        >
          Investment
        </Link>
      </Button>
      <Button asChild variant={"ghost"}>
        <Link
          href="/blog"
          className="font-questrial uppercase tracking-widest text-xs"
        >
          Blog
        </Link>
      </Button>
      <Button asChild variant={"ghost"}>
        <Link
          href="/contact-us"
          className="font-questrial uppercase tracking-widest text-xs"
        >
          Contact Us
        </Link>
      </Button>
    </>
  );
};

export default PageLinks;
