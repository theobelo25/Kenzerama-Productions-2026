import { cn } from "@/lib/utils";
import type { InfoBlockProps } from "@/lib/directus/blocks/block_info";

type Props = {
  data: InfoBlockProps;
  className?: string;
};

/**
 * Centered landing section with Playfair heading and Questrial body text.
 */
export default function InfoBlock({ data, className }: Props) {
  const { id, title, description } = data;

  const bodyClassName = "w-full text-center text-foreground/90 font-questrial";

  return (
    <section
      className={cn("bg-background py-6 md:py-8", className)}
      aria-labelledby={id}
    >
      <div className="wrapper flex flex-col items-center space-y-5 md:space-y-8">
        <h2
          id={id}
          className="text-center text-foreground text-2xl font-playfair-display"
        >
          {title}
        </h2>
        <p className={bodyClassName}>{description}</p>
      </div>
    </section>
  );
}
