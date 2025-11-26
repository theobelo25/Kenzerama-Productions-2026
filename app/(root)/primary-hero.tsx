import VideoComponent from "@/components/video-component";
import homepageHeroTeaser from "@/videos/homepage_hero_video.mp4";
import SiteTitle from "../../components/motion/site-title";
import { APP_DESCRIPTION_SHORT, APP_NAME } from "@/lib/constants";

const PrimaryHero = () => {
  return (
    <section className="flex flex-col justify-center w-full max-h-screen overflow-hidden pb-10">
      <div className="relative flex items-end aspect-video overflow-hidden md:mx-10">
        <SiteTitle title={APP_NAME} eyebrow={APP_DESCRIPTION_SHORT} />
        <VideoComponent
          video={homepageHeroTeaser}
          classNames="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-1"
        />
      </div>
    </section>
  );
};

export default PrimaryHero;
