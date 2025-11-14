import { APP_NAME } from "@/lib/constants";
import bgImage from "@/public/images/message-from-kenzerama-bg.webp";
import Image from "next/image";
import PageTitle from "../page-title";

const AboutHero = () => {
  console.log(bgImage);

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
              Welcome, and thank you for considering Kenzerama Productions to be
              part of your wedding day! As the owners, we’re truly honored to be
              invited into such a personal and meaningful moment in your lives.
              We believe every love story deserves to be captured with care,
              creativity, and authenticity, and it’s our passion to turn your
              memories into a film you’ll cherish forever. We can’t wait to hear
              your story and help bring your vision to life.
              <br />
              <br />- Kenzie & Theo
            </p>
            <div className="absolute inset-0 bg-black opacity-70 -z-1 m-0"></div>
            <Image
              src={bgImage}
              alt={"background image"}
              className="absolute inset-0 -z-2"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHero;
