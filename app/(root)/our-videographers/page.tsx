import AboutHero from "./about-hero";
import OurTeams from "./our-teams";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import FrequentlyAskedQuestions from "./faq";
import PageTransition from "@/components/motion/page-transition";

const OurVideographersPage = () => {
  return (
    <PageTransition>
      <AboutHero />
      <OurTeams />
      <FrequentlyAskedQuestions />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default OurVideographersPage;
