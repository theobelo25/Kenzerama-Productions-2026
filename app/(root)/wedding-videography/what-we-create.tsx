const WhatWeCreate = () => {
  return (
    <section
      className="bg-background landing-section-y !py-8 md:!py-10"
      aria-labelledby="what-we-create-title"
    >
      <div className="wrapper flex flex-col items-center space-y-5 md:space-y-8">
        <h2
          id="what-we-create-title"
          className="text-center text-foreground text-2xl font-playfair-display"
        >
          What we create
        </h2>
        <p className="w-full text-center text-foreground/90 font-questrial">
          We create cinematic wedding films that feel honest, emotional, and
          timeless. Every video is crafted around your unique story, blending
          natural moments, intentional storytelling, and beautiful visuals so
          you can relive the feeling of your day for years to come.
        </p>
      </div>
    </section>
  );
};

export default WhatWeCreate;
