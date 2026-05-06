import AboutHero from "./about-hero";
import MessageFromKenzerama from "./message-from-kenzerama";
import OurTeams from "./our-teams";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import FrequentlyAskedQuestions from "./faq";
import PageTransition from "@/components/motion/page-transition";

const OurTeamPage = () => {
  return (
    <PageTransition>
      <AboutHero />
      <MessageFromKenzerama />
      <OurTeams />
      <FrequentlyAskedQuestions />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default OurTeamPage;
