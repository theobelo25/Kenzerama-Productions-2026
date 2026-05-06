import { Button } from "@/components/ui/button";
import Link from "@/components/link-component";

type NavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/our-team", label: "Our Team" },
  { href: "/wedding-videography", label: "Wedding Films" },
  { href: "/videography-packages", label: "Investment" },
  { href: "/contact-us", label: "Contact Us" },
];

const NavLinkButton = ({
  href,
  label,
  setOpen,
}: NavLink & {
  setOpen?: (open: boolean) => void;
}) => {
  return (
    <Button
      asChild
      variant={"ghost"}
      className="hover:text-kenzerama-pink-dark focus-visible:text-kenzerama-pink-dark"
    >
      <Link
        href={href}
        className="font-questrial uppercase tracking-widest text-xs"
        setOpen={setOpen}
        withTransition
      >
        {label}
      </Link>
    </Button>
  );
};

const PageLinks = ({ setOpen }: { setOpen?: (open: boolean) => void }) => {
  return (
    <>
      {NAV_LINKS.map((navLink) => (
        <NavLinkButton
          key={navLink.href}
          href={navLink.href}
          label={navLink.label}
          setOpen={setOpen}
        />
      ))}
    </>
  );
};

export default PageLinks;
