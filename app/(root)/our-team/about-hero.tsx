import bgImage from "@/public/images/about/message-from-kenzerama-bg.webp";
import SecondaryHero from "@/components/shared/secondary-hero";

const AboutHero = () => {
  return (
    <SecondaryHero
      title="Our Team"
      image={bgImage}
      imagePositionClass="object-[center_15%]"
    />
  );
};

export default AboutHero;
