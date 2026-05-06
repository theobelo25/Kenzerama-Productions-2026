import SiteTitle from "@/components/motion/site-title";
import { APP_NAME } from "@/lib/constants";
import DeferredHeroVideo from "./deferred-hero-video.client";

const PrimaryHero = () => {
  return (
    <section
      aria-labelledby="primary-hero-title"
      className="hero-section relative w-full h-[100vh] h-[100dvh] overflow-hidden -mt-[76px]"
    >
      <div className="relative w-full h-full overflow-hidden">
        <DeferredHeroVideo />
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-black/35"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end pb-14 md:pb-0">
          <SiteTitle
            id="primary-hero-title"
            title={APP_NAME}
            eyebrow="Editorial wedding films"
          />
        </div>
      </div>
    </section>
  );
};

export default PrimaryHero;
