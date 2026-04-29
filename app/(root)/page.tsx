import PrimaryHero from "./primary-hero";
import FeaturedWeddings from "./featured-weddings";
import WhoWeAre from "./who-we-are";
import Testimonials from "./testimonials";
import Instagram from "./instagram";
import ContactCta from "./contact-cta";
import PageTransition from "@/components/motion/page-transition";

const Homepage = () => {
  return (
    <PageTransition>
      <div className="landing-page-compact">
        <PrimaryHero />
        <WhoWeAre />
        <FeaturedWeddings isFeatured compactSpacing />
        <Testimonials />
        <Instagram compactSpacing />
        <ContactCta />
      </div>
    </PageTransition>
  );
};

export default Homepage;
