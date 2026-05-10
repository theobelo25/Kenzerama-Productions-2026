import type { PrimaryHeroProps } from "@/lib/directus/blocks/block_hero_primary";
import SiteTitle from "@/components/motion/site-title";
import DeferredHeroVideo from "./deferred-hero-video.client";

const PrimaryHero = ({ data }: { data: PrimaryHeroProps }) => {
  const { hero_video, title, eyebrow } = data;

  return (
    <section
      aria-labelledby="primary-hero-title"
      className="hero-section relative w-full h-screen overflow-hidden -mt-19"
    >
      <div className="relative w-full h-full overflow-hidden">
        {hero_video && <DeferredHeroVideo video={hero_video} />}
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-black/35"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end pb-14 md:pb-0">
          <SiteTitle id="primary-hero-title" title={title} eyebrow={eyebrow} />
        </div>
      </div>
    </section>
  );
};

export default PrimaryHero;
