import Image from "next/image";
import CtaLink from "@/components/ctas/cta-link";
import type { CtaBannerProps } from "@/lib/directus/blocks/block_cta_banner";
import { cn } from "@/lib/utils";
const DEFAULT_BACKGROUND_POSITION = "center 58%";

export default function CtaBanner({ data }: { data: CtaBannerProps }) {
  const {
    id,
    title,
    button_text,
    button_href,
    background_image,
    backgroundPosition = DEFAULT_BACKGROUND_POSITION,
    className,
  } = data;

  const headingId = `cta-banner-${id}-heading`;
  const resolvedTitle = title?.trim() ?? "";
  const resolvedButtonText = button_text?.trim() ?? "";
  const resolvedButtonHref = button_href?.trim() ?? "";
  const resolvedBackground = background_image?.trim() ?? "";
  const showTitle = resolvedTitle.length > 0;
  const showButton =
    resolvedButtonText.length > 0 && resolvedButtonHref.length > 0;
  const showBackground = resolvedBackground.length > 0;

  if (!showTitle && !showButton && !showBackground) {
    return null;
  }

  return (
    <section
      id={id}
      aria-labelledby={showTitle ? headingId : undefined}
      aria-label={showTitle ? undefined : "Call to action"}
      className={cn(
        "relative isolate overflow-hidden py-20 md:py-28",
        !showBackground && "bg-background",
        className,
      )}
    >
      {showBackground ? (
        <>
          <Image
            src={resolvedBackground}
            alt=""
            fill
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 object-cover"
            style={{ objectPosition: backgroundPosition }}
            sizes="100vw"
            quality={40}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 bg-black/35"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-black/20 via-black/5 to-black/15"
          />
        </>
      ) : null}
      <div className="relative z-10 wrapper flex flex-col items-center justify-center gap-6 text-center md:gap-8">
        {showTitle ? (
          <h2
            id={headingId}
            className={cn(
              "relative z-2 max-h-fit py-5 text-2xl md:text-3xl lg:text-4xl font-cinzel font-medium uppercase tracking-[1px]",
              showBackground ? "text-white" : "text-foreground",
            )}
          >
            {resolvedTitle}
          </h2>
        ) : null}
        {showButton ? (
          <CtaLink href={resolvedButtonHref}>{resolvedButtonText}</CtaLink>
        ) : null}
      </div>
    </section>
  );
}
