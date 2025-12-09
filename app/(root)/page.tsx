import PrimaryHero from "./primary-hero";
import FeaturedWeddings from "./featured-weddings";
import WhoWeAre from "./who-we-are";
import Testimonials from "./testimonials";
import Instagram from "./instagram";
import ContactCta from "./contact-cta";
import PageTransition from "@/components/motion/page-transition";

const Homepage = async () => {
  return (
    <PageTransition>
      <PrimaryHero />
      <FeaturedWeddings />
      <WhoWeAre />
      <Testimonials />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default Homepage;
