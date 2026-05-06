import { Suspense } from "react";
import PrimaryHero from "./primary-hero";
import FeaturedWeddings from "./featured-weddings";
import WhoWeAre from "./who-we-are";
import Instagram from "./instagram";
import ContactCta from "./contact-cta";
import TestimonialsClient from "./testimonials-client";

const Homepage = () => {
  return (
    <div className="landing-page-compact">
      <PrimaryHero />
      <Suspense fallback={null}>
        <FeaturedWeddings isFeatured compactSpacing />
      </Suspense>
      <WhoWeAre />
      <TestimonialsClient />
      <Suspense fallback={null}>
        <Instagram compactSpacing />
      </Suspense>
      <ContactCta />
    </div>
  );
};

export default Homepage;
