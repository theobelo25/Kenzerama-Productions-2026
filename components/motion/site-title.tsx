import HeroCtaLink from "@/components/shared/hero-cta-link";

const SiteTitle = ({
  id,
  title,
  eyebrow,
  ctaLabel,
  ctaHref,
}: {
  id?: string;
  title: string;
  eyebrow: string;
  ctaLabel?: string;
  ctaHref?: string;
}) => {
  return (
    <h1
      id={id}
      className="pointer-events-none relative z-10 my-5 ml-5 inline-block max-w-[min(100%,calc(100vw-2.5rem))] rounded-2xl bg-black/35 px-[1.96875rem] py-4 shadow-lg shadow-black/25 backdrop-blur-md [mask-image:radial-gradient(ellipse_95%_100%_at_50%_50%,#000_62%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_95%_100%_at_50%_50%,#000_62%,transparent_100%)] md:my-15 md:ml-15 md:px-[2.8125rem] md:py-8 lg:my-25 lg:ml-25 lg:rounded-3xl lg:px-[3.375rem] text-kenzerama-pink text-3xl md:text-4xl lg:text-5xl font-cinzel uppercase"
    >
      <span className="sr-only">
        {title} - {eyebrow}
      </span>
      <span className="pointer-events-none" aria-hidden>
        {title.split("").map((c, i) => {
          if (c === " ") return <br key={`${i}-space`} />;
          return (
            <span key={`${i}-${c}`}>
              {c}
            </span>
          );
        })}
      </span>
      {eyebrow && (
        <span className="eyebrow pointer-events-none text-[0.4em]" aria-hidden>
          {eyebrow}
        </span>
      )}
      {ctaLabel && ctaHref && (
        <span className="mt-3 block text-sm md:text-base font-playfair-display normal-case">
          <HeroCtaLink href={ctaHref} pointerEventsAuto>
            {ctaLabel}
          </HeroCtaLink>
        </span>
      )}
    </h1>
  );
};

export default SiteTitle;
