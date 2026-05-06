import { Button } from "@/components/ui/button";
import type { Vendor } from "@/types";
import { ExternalLink } from "lucide-react";

const Vendors = ({ vendors }: { vendors: Vendor[] }) => {
  return (
    <section className="col-span-2 md:col-span-6">
      <ul className="flex flex-row flex-wrap items-center justify-center gap-2">
          {vendors.map((vendor) => (
            <li key={vendor.name}>
              {vendor.url ? (
                <Button
                  asChild
                  variant={"outline"}
                  className="h-auto flex flex-row items-center justify-between !px-7 has-[>svg]:!px-7 py-3"
                >
                  <a
                    href={vendor.url}
                    target="_blank"
                    rel="noopenner noreferrer"
                  >
                    <span className="w-full">
                      {vendor.name} - {vendor.title}
                    </span>
                    <ExternalLink />
                  </a>
                </Button>
              ) : (
                <Button variant={"outline"} className="h-auto !px-7 py-3">
                  {vendor.name}
                </Button>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
};

export default Vendors;
