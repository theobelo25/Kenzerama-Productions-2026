import ExtraItem from "./extra-item";
import type { ExtrasProps } from "@/lib/directus/blocks/block_extras";

type Props = {
  data: ExtrasProps;
};

export default function ExtrasSection({ data }: Props) {
  const headingId = data.id;

  return (
    <section className="pb-10 wrapper flex flex-col items-center mt-5">
      <div className="w-full" role="region" aria-labelledby={headingId}>
        <h2 id={headingId} className="mb-4 h2-subheading">
          {data.title}
        </h2>
        <ul
          className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10"
          aria-labelledby={headingId}
        >
          {data.extras.map((extraItem, index) => (
            <ExtraItem
              key={`${extraItem.title}-${index}`}
              extraItem={extraItem}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
