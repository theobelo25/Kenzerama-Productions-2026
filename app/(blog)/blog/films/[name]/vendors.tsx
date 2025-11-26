import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Vendor } from "@/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import logo from "@/public/images/logo.webp";
import { APP_NAME } from "@/lib/constants";

const Vendors = ({ vendors }: { vendors: Vendor[] }) => {
  return (
    <Card className="relative col-span-2 md:col-span-3 bg-transparent overflow-hidden">
      <Image
        src={logo}
        alt={`${APP_NAME} logo`}
        className="absolute top-[50%] left-[50%] h-auto w-full -z-1 -translate-[50%] opacity-18"
      />
      <CardHeader>
        <h3>Vendors</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {vendors.map((vendor) => (
            <li key={vendor.name}>
              {vendor.url ? (
                <Button
                  asChild
                  variant={"outline"}
                  className="w-full flex flex-row justify-between"
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
                <Button variant={"outline"}>{vendor.name}</Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Vendors;
