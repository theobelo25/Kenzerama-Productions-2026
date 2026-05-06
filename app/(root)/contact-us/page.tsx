import PageTransition from "@/components/motion/page-transition";
import Instagram from "../instagram";
import SecondaryHero from "@/components/shared/secondary-hero";
import contactBgImage from "@/public/images/contact-header.jpg";
import ContactLinks from "@/components/shared/header/contact-links";
import ContactFormWrapper from "./contact-form-wrapper";

const ContactUsPage = () => {
  return (
    <PageTransition>
      <SecondaryHero title="Contact Us" image={contactBgImage} imagePin="center" />
      <section className="bg-background landing-section-y !pb-0 md:!pb-0 !pt-8 md:!pt-10">
        <div className="wrapper flex flex-col items-center space-y-5 md:space-y-8">
          <p className="w-full text-center text-foreground/90 font-questrial">
            We are so excited to hear more about your wedding, and what you
            have planned so far! Want to find out if we are available on your
            date? Please fill out the contact form below, and we will get back
            to you within 24 hours.
          </p>
        </div>
      </section>
      <ContactFormWrapper />
      <section aria-labelledby="alternate-contact-heading">
        <h2 id="alternate-contact-heading" className="h2-subheading mb-10">
          More ways to reach us
        </h2>
        <ContactLinks
          className="justify-center mb-10"
          buttonClassName="text-foreground hover:text-kenzerama-pink-dark focus-visible:text-kenzerama-pink-dark"
          iconSize={30}
        />
      </section>
      <Instagram />
    </PageTransition>
  );
};

export default ContactUsPage;
