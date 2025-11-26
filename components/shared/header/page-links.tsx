import { Button } from "@/components/ui/button";
import Link from "@/components/link-component";

const PageLinks = ({ setOpen }: { setOpen?: (open: boolean) => void }) => {
  return (
    <>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/our-videographers"
          className="font-questrial uppercase tracking-widest text-xs"
          setOpen={setOpen}
        >
          Our Team
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/wedding-videography"
          className="font-questrial uppercase tracking-widest text-xs "
          setOpen={setOpen}
        >
          Wedding Films
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/videography-packages"
          className="font-questrial uppercase tracking-widest text-xs"
          setOpen={setOpen}
        >
          Investment
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/blog"
          className="font-questrial uppercase tracking-widest text-x"
          setOpen={setOpen}
        >
          Blog
        </Link>
      </Button>
      <Button asChild variant={"ghost"} className="hover:text-kenzerama-pink">
        <Link
          href="/contact-us"
          className="font-questrial uppercase tracking-widest text-xs"
          setOpen={setOpen}
        >
          Contact Us
        </Link>
      </Button>
    </>
  );
};

export default PageLinks;
