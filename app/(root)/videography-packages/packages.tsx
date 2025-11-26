import PackageItem from "./package-item";
import ExtraItem from "./extra-item";
import { PACKAGES, EXTRAS } from "@/data/packages";

const Packages = () => {
  return (
    <section className="pb-10 wrapper flex flex-col items-center">
      <h2 className="h2-subheading mb-10">Wedding Packages</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
        {PACKAGES.map((packageItem, index) => (
          <PackageItem
            key={packageItem.includes[0] + index}
            packageItem={packageItem}
          />
        ))}
      </ul>
      <h2 className="mt-5 mb-10 h2-subheading">Extras</h2>
      <ul className="max-md:w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        {EXTRAS.map((extraItem) => (
          <ExtraItem key={extraItem.title} extraItem={extraItem} />
        ))}
      </ul>
    </section>
  );
};

export default Packages;
