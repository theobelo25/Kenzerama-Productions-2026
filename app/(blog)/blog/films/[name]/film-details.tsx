import Vendors from "./vendors";
import VenueComponent from "./venue";
import type { Venue, Vendor } from "@/types";

const FilmDetails = ({
  details: { venue, vendors },
}: {
  details: {
    venue: Venue;
    vendors: Vendor[];
  };
}) => {
  return (
    <section className="wrapper">
      <h2 className="h2-subheading mb-10">Details</h2>
      <div className="grid grid-cols-5 gap-10">
        <VenueComponent venue={venue} />
        <Vendors vendors={vendors} />
      </div>
    </section>
  );
};

export default FilmDetails;
