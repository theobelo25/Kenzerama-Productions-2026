import FilmTileGrid from "@/components/media/wedding-films/film-tile-grid";
import VideoAssetGrid from "@/components/media/wedding-films/video-asset-grid";
import CtaLink from "@/components/ctas/cta-link";
import SectionWithHeading from "@/components/sections/section-with-heading";
import { cn } from "@/lib/utils";
import type { Film } from "@/types";
import type { VideoBlockProps as VideoBlockData } from "@/lib/directus/blocks/block_videos";

export type WeddingFilmsProps = {
  isFeatured: boolean;
  compactSpacing?: boolean;
  noTopPadding?: boolean;
  /** CMS video block for the section. */
  data?: VideoBlockData | null;
  /** Curated films when not using `data`. */
  featured?: Film[];
};

const WeddingFilms = ({
  isFeatured,
  compactSpacing = false,
  noTopPadding = false,
  data,
  featured,
}: WeddingFilmsProps) => {
  const cms: VideoBlockData | null =
    data != null && Array.isArray(data.videos) && data.videos.length > 0
      ? data
      : null;

  const headingId = cms
    ? `video-block-${cms.id}`
    : isFeatured
      ? "wedding-films-heading"
      : "our-videos-heading";

  const heading = cms
    ? cms.title
    : isFeatured
      ? "Featured Weddings"
      : "Our Videos";

  const gridFilms = featured ?? [];

  const headingGap = compactSpacing ? "mb-4 md:mb-5" : "mb-8 md:mb-10";
  const ctaGap = compactSpacing ? "mt-5 md:mt-6" : "mt-10 md:mt-12";
  const sectionSpacingClass = isFeatured
    ? "landing-section-y"
    : "pb-12 md:pb-16";

  const defaultFeaturedBlurb = (
    <p className="text-center text-sm text-foreground/80">
      Real love stories, filmed cinematically across Toronto & beyond.
    </p>
  );

  const headingContent = cms ? null : isFeatured ? defaultFeaturedBlurb : null;

  const hasVideos = cms ? cms.videos.length > 0 : gridFilms.length > 0;
  const showLegacyFeaturedCta = !cms && isFeatured && hasVideos;

  const cmsCta =
    cms &&
    cms.button_text &&
    cms.button_href &&
    cms.button_href.trim() !== "" ? (
      <div className={cn("wrapper flex justify-center", ctaGap)}>
        <CtaLink href={cms.button_href}>{cms.button_text}</CtaLink>
      </div>
    ) : null;

  return (
    <SectionWithHeading
      headingId={headingId}
      heading={heading}
      headingContent={headingContent}
      sectionClassName={cn(
        sectionSpacingClass,
        compactSpacing && "!pt-0 !pb-8 md:!pb-10",
        noTopPadding && "!pt-0",
        isFeatured && "!pb-0 md:!pb-0",
      )}
      wrapperClassName={cn("flex flex-col gap-4", headingGap)}
      headingClassName="relative text-center"
      contentPlacement="afterWrapper"
    >
      {hasVideos ? (
        cms ? (
          <VideoAssetGrid
            videos={cms.videos}
            ariaLabel={cms.title || "Videos"}
          />
        ) : (
          <FilmTileGrid
            films={gridFilms}
            ariaLabel={isFeatured ? "Featured wedding films" : "Our videos"}
          />
        )
      ) : (
        <p className="text-center text-sm text-muted-foreground font-questrial">
          Wedding films are temporarily unavailable.
        </p>
      )}
      {cmsCta}
      {showLegacyFeaturedCta ? (
        <div className={cn("wrapper flex justify-center", ctaGap)}>
          <CtaLink href="/wedding-videography">View all wedding films</CtaLink>
        </div>
      ) : null}
    </SectionWithHeading>
  );
};

export default WeddingFilms;
