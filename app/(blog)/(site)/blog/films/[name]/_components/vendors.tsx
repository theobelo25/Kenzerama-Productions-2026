import { Button } from "@/components/ui/button";
import type { Vendor } from "@/types";
import { ExternalLink } from "lucide-react";

const Vendors = ({ vendors }: { vendors: Vendor[] }) => {
  return (
    <section className="col-span-2 md:col-span-6">
      <ul className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          {vendors.map((vendor) => (
            <li key={vendor.name} className="w-full sm:w-auto">
              {vendor.url ? (
                <Button
                  asChild
                  variant={"outline"}
                  className="h-auto w-full flex flex-row items-center justify-between !px-7 has-[>svg]:!px-7 py-3 sm:w-auto"
                >
                  <a
                    href={vendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <span className="w-full">
                      {vendor.name} - {vendor.title}
                    </span>
                    <ExternalLink />
                  </a>
                </Button>
              ) : (
                <Button
                  variant={"outline"}
                  className="h-auto w-full !px-7 py-3 sm:w-auto"
                >
                  {vendor.title
                    ? `${vendor.name} - ${vendor.title}`
                    : vendor.name}
                </Button>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
};

export default Vendors;
