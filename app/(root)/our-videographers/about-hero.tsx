import { APP_NAME } from "@/lib/constants";
import bgImage from "./public/images/about/message-from-kenzerama-bg.webp";
import Image from "next/image";
import PageTitle from "../page-title";

const AboutHero = () => {
  return (
    <>
      <PageTitle title="About Us" />
      <section className="flex flex-col text-center overflow-hidden min-h-fit">
        <div className="relative h-full">
          <div className="flex flex-col h-full justify-center items-end wrapper space-y-3 md:space-y-8 md:py-10 lg:py-15">
            <h2 className="text-left text-xl md:text-3xl lg:text-5xl text-white w-full">
              Message from
              <br />
              <span className="text-kenzerama-pink font-cinzel">
                {APP_NAME}
              </span>
            </h2>
            <p className="text-right text-white text-xs md:text-base lg:text-2xl font-questrial w-[80%]">
              Over the last sixteen years, our team has been crafting the art of
              cinematic storytelling through each and every one of our wedding
              films. Through the use of our candid and creative approach to
              shooting with an editorial flair, each one of our films represents
              a personalized story of your relationship together. No two
              weddings are alike, so your wedding film shouldn&apos;t be either.
              Let&apos;s create something as uniquely beautiful as your love
              story. We can&apos;t wait to hear your story, and help bring your
              vision to life.
              <br />
              <br />- Kenzie & Theo
            </p>
            <div className="absolute inset-0 bg-black opacity-70 -z-1 m-0"></div>
            <Image
              src={bgImage}
              alt={"background image"}
              className="aspect-video absolute top-[50%] left-[50%] -z-2 -translate-[50%] object-cover h-full"
              width={0}
              height={0}
              sizes="50vw, 100vw"
              fetchPriority="high"
              placeholder="blur"
              loading="eager"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHero;
