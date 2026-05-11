import { APP_NAME } from "@/lib/constants";
import VideoComponent from "../../components/video-component";
import whoWeAreVideo from "@/videos/homepage_about.mp4";
import { Button } from "../../components/ui/button";
import Link from "@/components/link-component";

const WhoWeAre = () => {
  return (
    <section className="bg-ring py-10">
      <div className="wrapper grid grid-cols-1 md:grid-cols-5">
        <VideoComponent
          video={whoWeAreVideo}
          classNames="aspect-video-portrait col-span-1 md:col-span-2 lg:col-span-1 rounded-sm overflow-hidden mb-10 md:mb-0"
        />
        <div className="flex flex-col items-end md:col-span-3 lg:col-span-4  md:pl-10 lg:pl-30 space-y-10 md:space-y-15">
          <h2 className="text-right text-white text-2xl font-playfair-display">
            Who is{" "}
            <span className="text-kenzerama-pink-light font-cinzel text-4xl">
              {APP_NAME}{" "}
            </span>
            ?
          </h2>
          <p className="text-white font-questrial">
            Over the last sixteen years, our team has been crafting the art of
            cinematic storytelling through each and every one of our wedding
            films. Through the use of our candid and creative approach to
            shooting with an editorial flair, each one of our films represents a
            personalized story of your relationship together. No two weddings
            are alike, so your wedding film shouldn't be either. Let's create
            something as uniquely beautiful as your love story. We can't wait to
            hear your story, and help bring your vision to life.
          </p>
          <Button
            asChild
            variant={"outline"}
            className="w-[60%] min-w-[300px] ml-auto"
          >
            <Link href="/our-videographers">Find out more about us!</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
