import { APP_NAME } from "@/lib/constants";
import VideoComponent from "../../components/video-component";
import whoWeAreVideo from "@/videos/homepage_about.mp4";
import { Button } from "../../components/ui/button";
import Link from "next/link";

const WhoWeAre = () => {
  return (
    <section className="bg-background-grey py-10">
      <div className="wrapper grid grid-cols-5">
        <VideoComponent
          video={whoWeAreVideo}
          classNames="aspect-video-portrait col-span-1 rounded-sm overflow-hidden"
        />
        <div className="flex flex-col items-end col-span-4 pl-30">
          <h2 className="text-right text-white text-2xl font-playfair-display mb-15">
            Who is{" "}
            <span className="text-kenzerama-pink font-cinzel text-4xl">
              {APP_NAME}{" "}
            </span>
            ?
          </h2>
          <p className="text-white font-questrial mb-20">
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
            <Link href="/about-us">Find out more about us!</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
