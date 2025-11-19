import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import type { Venue } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const VenueComponent = ({ venue }: { venue: Venue }) => {
  return (
    <a
      href={venue.url ? venue.url : "#"}
      target="_blank"
      rel="noopenner noreferrer"
      className="col-span-3"
    >
      <Card className="relative col-span-3 overflow-hidden bg-transparent">
        <Image
          src={venue.image}
          alt={venue.name}
          className="absolute left-[50%] top-[50%] -translate-[50%] h-auto w-full -z-2 object-fit"
          width={0}
          height={0}
          sizes="50vw, 100vw"
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-80 -z-1" />
        <CardHeader>
          <h3 className="text-white">Venue</h3>
        </CardHeader>
        <CardContent className="py-10">
          <h4
            aria-label="venue name"
            className="text-white text-3xl font-cinzel"
          >
            {venue.name}
          </h4>
          <h4 className="text-white font-questrial">{venue.location}</h4>
        </CardContent>
        <CardFooter>
          {venue.url && (
            <CardAction>
              <Button variant={"outline"} className="cursor-pointer">
                Visit <ExternalLink />
              </Button>
            </CardAction>
          )}
        </CardFooter>
      </Card>
    </a>
  );
};

export default VenueComponent;
