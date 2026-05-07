import { cn } from "@/lib/utils";

const PageTitle = ({
  title,
  subtitle,
  className,
  headingClassName,
  "aria-busy": ariaBusy,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  headingClassName?: string;
  "aria-busy"?: boolean;
}) => {
  return (
    <section
      className={cn(
        "flex min-h-fit flex-col overflow-hidden text-center",
        className,
      )}
      aria-busy={ariaBusy}
    >
      <h1
        className={cn(
          "pt-5 text-kenzerama-pink text-2xl md:text-3xl lg:text-4xl font-cinzel uppercase",
          headingClassName,
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="pb-5 font-playfair-display text-black text-sm leading-snug md:text-base">
          {subtitle}
        </p>
      ) : null}
    </section>
  );
};

export default PageTitle;
