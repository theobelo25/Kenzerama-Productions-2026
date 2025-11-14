import CarouselComponent from "@/components/shared/carousel";

const Instagram = () => {
  return (
    <section className="bg-background-grey">
      <div className="wrapper space-y-10">
        <h2 className="relative text-center text-white text-2xl font-playfair-display after:content-[''] after:absolute after:left-[50%] after:-translate-x-[50%]  after:-bottom-1 after:bg-kenzerama-pink after:w-[275px] after:h-px">
          Follow us on Instagram!
        </h2>
        <CarouselComponent type="instagram" />
      </div>
    </section>
  );
};

export default Instagram;
