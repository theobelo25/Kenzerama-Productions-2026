import PageTitle from "../page-title";
import Packages from "./packages";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import PageTransition from "@/components/motion/page-transition";

const VideographyPackagesPage = () => {
  return (
    <PageTransition>
      <PageTitle title="Our Packages" />
      <Packages />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default VideographyPackagesPage;
