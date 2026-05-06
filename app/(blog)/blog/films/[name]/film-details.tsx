import Vendors from "./vendors";
import type { Vendor } from "@/types";

const FilmDetails = ({
  details: { vendors },
}: {
  details: {
    vendors: Vendor[];
  };
}) => {
  return (
    <section className="wrapper">
      <h2 className="h2-subheading mb-10">Vendors</h2>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-y-3 md:gap-10">
        <Vendors vendors={vendors} />
      </div>
    </section>
  );
};

export default FilmDetails;
