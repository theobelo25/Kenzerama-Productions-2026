import FilmTileGrid from "@/components/shared/film-tile-grid";
import CtaLink from "@/components/shared/cta-link";
import SectionWithHeading from "@/components/shared/section-with-heading";
import { cn } from "@/lib/utils";
import { filmData } from "@/info/films";

const FeaturedWeddings = ({
  isFeatured,
  compactSpacing = false,
  noTopPadding = false,
}: {
  isFeatured: boolean;
  compactSpacing?: boolean;
  noTopPadding?: boolean;
}) => {
  const films = isFeatured ? filmData.filter((film) => film.isFeatured) : filmData;

  const headingId = isFeatured
    ? "featured-weddings-heading"
    : "our-videos-heading";

  const displayFilms = isFeatured ? films.slice(0, 6) : films;

  const headingGap = compactSpacing ? "mb-4 md:mb-5" : "mb-8 md:mb-10";
  const ctaGap = compactSpacing ? "mt-5 md:mt-6" : "mt-10 md:mt-12";
  const sectionSpacingClass = isFeatured
    ? "landing-section-y"
    : "pb-12 md:pb-16";

  return (
    <SectionWithHeading
      headingId={headingId}
      heading={isFeatured ? "Featured Weddings" : "Our Videos"}
      headingContent={
        isFeatured ? (
          <p className="text-center text-sm text-foreground/80">
            Real love stories, filmed cinematically across Toronto & beyond.
          </p>
        ) : null
      }
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
      <FilmTileGrid
        films={displayFilms}
        ariaLabel={isFeatured ? "Featured wedding films" : "Our videos"}
      />
      {isFeatured && (
        <div className={cn("wrapper flex justify-center", ctaGap)}>
          <CtaLink href="/wedding-videography">
            View all wedding films
          </CtaLink>
        </div>
      )}
    </SectionWithHeading>
  );
};

export default FeaturedWeddings;

