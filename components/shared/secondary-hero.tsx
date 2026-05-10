import type { StaticImageData } from "next/image";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SecondaryHeroProps as CmsSecondaryHeroProps } from "@/lib/directus/blocks/block_hero_secondary";

export function secondaryHeroImagePositionClass(
  imagePosition: string,
  imageShift: number,
): string {
  const pos = imagePosition.trim().toLowerCase() || "center";
  if (imageShift === 0) {
    if (pos === "top") return "object-top";
    if (pos === "bottom") return "object-bottom";
    return "object-center";
  }
  return `object-[${pos}_${imageShift}%]`;
}

type LegacySecondaryHeroProps = {
  title: string;
  image: StaticImageData;
  imageAlt?: string;
  /** Focal point for `object-cover` (`object-position`). */
  imagePin?: "top" | "center" | "bottom";
  /** Optional custom object-position class (e.g. `object-[center_75%]`). */
  imagePositionClass?: string;
};

type Props = { data: CmsSecondaryHeroProps } | LegacySecondaryHeroProps;

const SecondaryHero = (props: Props) => {
  if ("data" in props) {
    const { data } = props;
    const objectPositionClass = secondaryHeroImagePositionClass(
      data.image_position,
      data.image_shift,
    );
    return (
      <section className="flex min-h-fit flex-col overflow-hidden text-center -mt-[76px]">
        <div className="relative h-full">
          <div className="relative min-h-[240px] md:min-h-[360px] lg:min-h-[460px]">
            <div className="absolute inset-0 z-1 flex items-center justify-center px-4">
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-cinzel">
                {data.title}
              </h1>
            </div>
            <div className="absolute inset-0 bg-black opacity-70 -z-1 m-0"></div>
            <Image
              src={data.hero_image}
              alt=""
              className={cn(
                "absolute inset-0 -z-2 h-full w-full object-cover",
                objectPositionClass,
              )}
              width={1920}
              height={1080}
              sizes="100vw"
              fetchPriority="high"
              placeholder="empty"
              loading="eager"
            />
          </div>
        </div>
      </section>
    );
  }

  const {
    title,
    image,
    imageAlt = "",
    imagePin = "bottom",
    imagePositionClass,
  } = props as LegacySecondaryHeroProps;

  const objectPositionClass =
    imagePositionClass ??
    (imagePin === "top"
      ? "object-top"
      : imagePin === "center"
        ? "object-center"
        : "object-bottom");
  return (
    <section className="flex min-h-fit flex-col overflow-hidden text-center -mt-[76px]">
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
