import { Button } from "@/components/ui/button";
import Link from "@/components/link-component";

const PageLinks = () => {
  return (
    <>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/our-videographers"
          className="font-questrial uppercase tracking-widest text-xs"
        >
          Our Team
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/wedding-videography"
          className="font-questrial uppercase tracking-widest text-xs "
        >
          Wedding Films
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/videography-packages"
          className="font-questrial uppercase tracking-widest text-xs"
        >
          Investment
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/blog"
          className="font-questrial uppercase tracking-widest text-x"
        >
          Blog
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
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
