import PrimaryHero from "./primary-hero";
import FeaturedWeddings from "./featured-weddings";
import WhoWeAre from "./who-we-are";
import Testimonials from "./testimonials";
import Instagram from "./instagram";
import ContactCta from "./contact-cta";

const Homepage = () => {
  return (
    <>
      <PrimaryHero />
      <FeaturedWeddings />
      <WhoWeAre />
      <Testimonials />
      <Instagram />
      <ContactCta />
    </>
  );
};

export default Homepage;
