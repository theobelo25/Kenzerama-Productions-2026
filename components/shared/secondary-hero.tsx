import type { StaticImageData } from "next/image";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SecondaryHeroProps = {
  title: string;
  image: StaticImageData;
  imageAlt?: string;
  /** Focal point for `object-cover` (`object-position`). */
  imagePin?: "top" | "center" | "bottom";
};

const SecondaryHero = ({
  title,
  image,
  imageAlt = "",
  imagePin = "bottom",
}: SecondaryHeroProps) => {
  const objectPositionClass =
    imagePin === "top"
      ? "object-top"
      : imagePin === "center"
        ? "object-center"
        : "object-bottom";
  return (
    <section className="flex flex-col text-center overflow-hidden min-h-fit">
      <div className="relative h-full">
        <div className="relative min-h-[240px] md:min-h-[360px] lg:min-h-[460px]">
          <div className="absolute inset-0 z-1 flex items-center justify-center px-4">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-cinzel">
              {title}
            </h1>
          </div>
          <div className="absolute inset-0 bg-black opacity-70 -z-1 m-0"></div>
          <Image
            src={image}
            alt={imageAlt}
            className={cn(
              "absolute inset-0 -z-2 h-full w-full object-cover",
              objectPositionClass,
            )}
            width={0}
            height={0}
            sizes="100vw"
            fetchPriority="high"
            placeholder="blur"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default SecondaryHero;
