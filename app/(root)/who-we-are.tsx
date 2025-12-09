import { APP_NAME } from "@/lib/constants";
import VideoComponent from "../../components/video-component";
import whoWeAreVideo from "@/videos/homepage_about.mp4";
import { Button } from "../../components/ui/button";
import Link from "@/components/link-component";

const WhoWeAre = () => {
  return (
    <section className="bg-background-grey py-10">
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
            Your wedding day is a beautiful chapter in your love story — and at
            Kenzerama Productions, we’re here to capture every heartfelt moment
            with artistry and care. From the quiet, stolen glances to the joyous
            laughter shared with loved ones, we preserve the emotions that make
            your day truly unforgettable. With a deep passion for storytelling
            and a romantic cinematic style, we create films that let you relive
            the magic of your wedding again and again. Let us turn your love
            into a timeless work of art.
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
