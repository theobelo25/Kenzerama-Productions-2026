import { APP_NAME } from "@/lib/constants";
import CtaLink from "@/components/shared/cta-link";

const WhoWeAre = () => {
  return (
    <section
      className="bg-background landing-section-y !pt-0 !pb-8 md:!pb-10"
      aria-labelledby="who-we-are-title"
    >
      <div className="wrapper flex flex-col items-center space-y-5 md:space-y-8">
        <h2
          id="who-we-are-title"
          className="text-center text-foreground text-2xl font-playfair-display"
        >
          Who is{" "}
          <span className="text-kenzerama-pink font-cinzel text-4xl">
            {APP_NAME}{" "}
          </span>
          ?
        </h2>
        <p className="w-full text-center text-foreground/90 font-questrial">
          Over the last sixteen years, our team has been crafting the art of
          cinematic storytelling through each and every one of our wedding
          films. Through the use of our candid and creative approach to shooting
          with an editorial flair, each one of our films represents a
          personalized story of your relationship together. No two weddings are
          alike, so your wedding film shouldn't be either. Let's create something
          as uniquely beautiful as your love story. We can't wait to hear your
          story, and help bring your vision to life.
        </p>
        <CtaLink href="/our-team" className="self-center">
          Find out more about us!
        </CtaLink>
      </div>
    </section>
  );
};

export default WhoWeAre;
