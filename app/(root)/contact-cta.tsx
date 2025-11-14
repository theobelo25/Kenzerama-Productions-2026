import { Button } from "@/components/ui/button";
import Link from "next/link";

const ContactCta = () => {
  return (
    <section className="bg-kenzerama-pink">
      <div className="wrapper flex justify-center items-center">
        <h2 className="font-playfair-display text-2xl text-white mr-10">
          Let's Connect
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
