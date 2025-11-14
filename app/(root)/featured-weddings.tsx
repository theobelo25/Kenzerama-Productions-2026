import Carousel from "../../components/shared/carousel";

const FeaturedWeddings = () => {
  return (
    <section>
      <h2 className="relative text-center text-2xl font-playfair-display mb-10 after:content-[''] after:absolute after:left-[50%] after:-translate-x-[50%]  after:-bottom-1 after:bg-kenzerama-pink after:w-[275px] after:h-px">
        Featured Weddings
      </h2>
      <Carousel type="poster" />
    </section>
  );
};

export default FeaturedWeddings;
