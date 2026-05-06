import { Suspense } from "react";
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
      <Suspense fallback={null}>
        <FeaturedWeddings isFeatured={false} noTopPadding />
      </Suspense>
      <Suspense fallback={null}>
        <Instagram />
      </Suspense>
      <Suspense fallback={null}>
        <ContactCta />
      </Suspense>
    </PageTransition>
  );
};

export default WeddingVideographyPage;
