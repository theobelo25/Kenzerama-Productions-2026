import { Button } from "@/components/ui/button";
import Link from "@/components/link-component";

const ContactCta = () => {
  return (
    <section className="bg-kenzerama-pink-light">
      <div className="wrapper flex justify-center items-center">
        <h2 className="font-playfair-display text-2xl text-white mr-10">
          Let&apos;s Connect
        </h2>
        <Button
          asChild
          variant={"outline"}
          className="text-sm text-kenzerama-pink font-playfair-display"
        >
          <Link href={"/contact-us"}>Book a consultation</Link>
        </Button>
      </div>
    </section>
  );
};

export default ContactCta;
