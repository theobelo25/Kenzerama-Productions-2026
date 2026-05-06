import PackageItem from "./package-item";
import ExtraItem from "./extra-item";
import { PACKAGES, EXTRAS } from "@/info/packages";

const Packages = () => {
  return (
    <section className="pb-10 wrapper flex flex-col items-center">
      <div className="w-full" role="region" aria-labelledby="wedding-packages-heading">
        <h2 id="wedding-packages-heading" className="h2-subheading mb-10">
          Wedding Packages
        </h2>
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8"
          aria-labelledby="wedding-packages-heading"
        >
          {PACKAGES.map((packageItem, index) => (
            <PackageItem
              key={packageItem.includes[0] + index}
              packageItem={packageItem}
              index={index}
            />
          ))}
        </ul>
      </div>

      <div
        className="mt-5 w-full"
        role="region"
        aria-labelledby="package-extras-heading"
      >
        <h2 id="package-extras-heading" className="mb-4 h2-subheading">
          Extras
        </h2>
        <ul
          className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10"
          aria-labelledby="package-extras-heading"
        >
          {EXTRAS.map((extraItem) => (
            <ExtraItem key={extraItem.title} extraItem={extraItem} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Packages;
