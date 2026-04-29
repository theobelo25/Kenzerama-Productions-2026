import { Suspense } from "react";
import VideoComponent from "@/components/video-component";
import homepageHeroTeaser from "@/videos/homepage_hero_video.mp4";
import SiteTitle from "@/components/motion/site-title";
import { APP_DESCRIPTION_SHORT, APP_NAME } from "@/lib/constants";
import HeroScrollCue from "@/components/shared/hero-scroll-cue";

const HeroVideoFallback = () => (
  <div className="absolute inset-0 z-0 bg-black/70" aria-hidden />
);

const PrimaryHero = () => {
  return (
    <section
      aria-labelledby="primary-hero-title"
      className="hero-section relative w-full h-[100vh] h-[100dvh] overflow-hidden -mt-[76px]"
    >
      <div className="relative w-full h-full overflow-hidden">
        <Suspense fallback={<HeroVideoFallback />}>
          <VideoComponent
            video={homepageHeroTeaser}
            autoplay
            loop
            showPlayPauseButton
            classNames="absolute inset-0 h-full w-full z-0"
            videoClassName="absolute inset-0 !block !h-full !w-full !max-w-none min-h-full min-w-full object-cover [--media-object-fit:cover] [--media-object-position:center_center]"
          />
        </Suspense>
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-black/35"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end pb-14 md:pb-0">
          <SiteTitle
            id="primary-hero-title"
            title={APP_NAME}
            eyebrow={"Editorial wedding films, crafted with emotion"}
            ctaLabel="Inquire about our availability"
            ctaHref="/contact-us"
          />
        </div>
        <HeroScrollCue />
      </div>
    </section>
  );
};

export default PrimaryHero;
