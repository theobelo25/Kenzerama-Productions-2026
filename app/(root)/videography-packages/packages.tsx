import PackageItem from "./package-item";
import ExtraItem from "./extra-item";

const TEMP_PACKAGES = [
  {
    title: "Package A",
    includes: [
      "Up to 7 Hours of Shooting",
      "2 Videographers",
      "Drone Videography",
      "10min Cinematic Edit",
      "Social Media Highlight",
      "Crystal USB Key",
      "Customized Box",
      "All raw footage provided on an external hard drive",
    ],
    price: "3,450.00",
  },
  {
    title: "Package B",
    includes: [
      "Up to 10 Hours of Shooting",
      "2 Videographers",
      "Drone Videography",
      "15min Cinematic Edit",
      "Social Media Highlight",
      "Crystal USB Key",
      "Customized Box",
      "All raw footage provided on an external hard drive",
    ],
    price: "4,145.00",
  },
  {
    title: "Package C",
    includes: [
      "Up to 12 Hours of Shooting",
      "2 Videographers",
      "Drone Videography",
      "20min Cinematic Edit",
      "Next Day Social Media Highlight",
      "Crystal USB Key",
      "Customized Box",
      "All raw footage provided on an external hard drive",
    ],
    price: "4,850.00",
  },
  {
    title: "Package D",
    includes: [
      "Unlimited Hours of Shooting",
      "2 Videographers",
      "Drone Videography",
      "25min+ Cinematic Edit",
      "Next Day Social Media Highlight",
      "3min Trailer",
      "Crystal USB Key",
      "Customized Box",
      "All raw footage provided on an external hard drive",
    ],
    price: "5,545.00",
  },
];
const TEMP_EXTRAS = [
  {
    title: "Additional Hours",
    price: "$500.00/hr",
  },
  {
    title: "Engagement Video",
    price: "$650.00",
  },
  {
    title: "Next-Day Edit (3min trailer)",
    price: "$650",
  },
  {
    title: "Same-Day Edit",
    price: "$1,200.00",
  },
];

const Packages = () => {
  return (
    <section className="pb-10 wrapper flex flex-col items-center">
      <h2 className="pink-title-underline text-center mb-8">
        Wedding Packages
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
        {TEMP_PACKAGES.map((packageItem, index) => (
          <PackageItem key={index} packageItem={packageItem} />
        ))}
      </ul>
      <h2 className="pink-title-underline text-center my-8">Extras</h2>
      <ul className="max-md:w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        {TEMP_EXTRAS.map((extraItem, index) => (
          <ExtraItem key={index} extraItem={extraItem} />
        ))}
      </ul>
    </section>
  );
};

export default Packages;
