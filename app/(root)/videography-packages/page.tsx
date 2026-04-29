import bgImage from "@/public/images/investment-bg.jpg";
import SecondaryHero from "@/components/shared/secondary-hero";
import Packages from "./packages";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import PageTransition from "@/components/motion/page-transition";
import InvestmentOverview from "./investment-overview";

const VideographyPackagesPage = () => {
  return (
    <PageTransition>
      <SecondaryHero title="Our Packages" image={bgImage} imagePin="top" />
      <InvestmentOverview />
      <Packages />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default VideographyPackagesPage;
