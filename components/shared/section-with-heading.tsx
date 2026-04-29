import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionWithHeadingProps = {
  headingId: string;
  heading: ReactNode;
  headingContent?: ReactNode;
  children: ReactNode;
  sectionClassName?: string;
  wrapperClassName?: string;
  headingClassName?: string;
  contentClassName?: string;
  contentPlacement?: "insideWrapper" | "afterWrapper";
};

const SectionWithHeading = ({
  headingId,
  heading,
  headingContent,
  children,
  sectionClassName,
  wrapperClassName,
  headingClassName,
  contentClassName,
  contentPlacement = "insideWrapper",
}: SectionWithHeadingProps) => {
  return (
    <section className={sectionClassName} aria-labelledby={headingId}>
      <div className={cn("wrapper", wrapperClassName)}>
        <h2 id={headingId} className={cn("h2-subheading", headingClassName)}>
          {heading}
        </h2>
        {headingContent}
        {contentPlacement === "insideWrapper" && (
          <div className={contentClassName}>{children}</div>
        )}
      </div>
      {contentPlacement === "afterWrapper" && (
        <div className={contentClassName}>{children}</div>
      )}
    </section>
  );
};

export default SectionWithHeading;
