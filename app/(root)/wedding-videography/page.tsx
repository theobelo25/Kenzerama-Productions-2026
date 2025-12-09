import PageTitle from "../page-title";
import FeaturedWeddings from "../featured-weddings";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import PageTransition from "@/components/motion/page-transition";

const WeddingVideographyPage = () => {
  return (
    <PageTransition>
      <PageTitle title="Wedding Films" />
      <FeaturedWeddings />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default WeddingVideographyPage;
