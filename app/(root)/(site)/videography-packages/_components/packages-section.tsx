import PackageItem from "./package-item";
import type { PackagesProps } from "@/lib/directus/blocks/block_packages";

type Props = {
  data: PackagesProps;
};

export default function PackagesSection({ data }: Props) {
  const headingId = data.id;

  return (
    <section className="pb-10 wrapper flex flex-col items-center">
      <div
        className="w-full"
        role="region"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="h2-subheading mb-10">
          {data.title}
        </h2>
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8"
          aria-labelledby={headingId}
        >
          {data.packages.map((packageItem, index) => (
            <PackageItem
              key={`${packageItem.title}-${index}`}
              packageItem={packageItem}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
