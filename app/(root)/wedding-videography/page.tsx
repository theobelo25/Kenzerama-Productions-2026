import FeaturedWeddings from "../featured-weddings";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import PageTransition from "@/components/motion/page-transition";
import WeddingHero from "./wedding-hero";
import WhatWeCreate from "./what-we-create";

const WeddingVideographyPage = () => {
  return (
    <PageTransition>
      <WeddingHero />
      <WhatWeCreate />
      <FeaturedWeddings isFeatured={false} noTopPadding />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default WeddingVideographyPage;
