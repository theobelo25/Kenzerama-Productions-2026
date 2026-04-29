import HeroCtaLink from "@/components/shared/hero-cta-link";

const CONTACT_BANNER_BG = "/images/contact-us-bg.jpg";

const ContactCta = () => {
  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="relative isolate overflow-hidden py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${CONTACT_BANNER_BG})`,
          backgroundPosition: "center 58%",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-black/35"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-black/5 to-black/15"
      />
      <div className="relative z-10 wrapper flex flex-col items-center justify-center gap-6 text-center md:gap-8">
        <h2
          id="contact-cta-heading"
          className="relative z-[2] max-h-fit py-5 text-2xl text-white md:text-3xl lg:text-4xl font-cinzel font-medium uppercase tracking-[1px]"
        >
          We&apos;d love to hear your story
        </h2>
        <HeroCtaLink href="/contact-us">Book a consultation</HeroCtaLink>
      </div>
    </section>
  );
};

export default ContactCta;
