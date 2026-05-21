import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { BrandedInfoProps } from "@/lib/directus/blocks/block_branded_info";
import CtaLink from "./cta-link";

export function BrandedAppName({ className }: { className?: string }) {
  return (
    <span className={cn("text-kenzerama-pink font-cinzel text-4xl", className)}>
      {APP_NAME}
    </span>
  );
}

/**
 * Centered info section with Playfair heading that inserts the Cinzel brand name
 * between optional before/after strings — matches “Who is …?” and “Message from …”.
 */
export default function BrandedInfoBlock({ data }: { data: BrandedInfoProps }) {
  const {
    id,
    info_title_before_brand,
    info_title_after_brand,
    content,
    button_text,
    button_href,
  } = data;

  const before = info_title_before_brand?.trim();
  const after = info_title_after_brand?.trim();

  return (
    <section
      className={cn("bg-background landing-section-y")}
      aria-labelledby={id}
    >
      <div className="wrapper flex flex-col items-center space-y-5 md:space-y-8">
        <h2
          id={id}
          className="text-center text-foreground text-2xl font-playfair-display"
        >
          {before ? <>{before} </> : null}
          <BrandedAppName />
          {after ? <> {after}</> : null}
        </h2>
        <p>{content}</p>
        {button_text && button_href ? (
          <div className="flex justify-center">
            <CtaLink href={button_href}>{button_text}</CtaLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
