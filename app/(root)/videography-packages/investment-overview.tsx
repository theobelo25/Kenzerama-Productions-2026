const InvestmentOverview = () => {
  return (
    <section
      className="bg-background landing-section-y !py-8 md:!py-10"
      aria-labelledby="investment-overview-title"
    >
      <div className="wrapper flex flex-col items-center space-y-5 md:space-y-8">
        <h2
          id="investment-overview-title"
          className="text-center text-foreground text-2xl font-playfair-display"
        >
          Built for your wedding story
        </h2>
        <p className="w-full text-center text-foreground/90 font-questrial">
          Our packages are designed to give you the coverage and creative
          support that best fits your day. From intimate celebrations to full
          weekend events, each collection balances storytelling, flexibility,
          and polished final films so your memories are preserved beautifully.
        </p>
      </div>
    </section>
  );
};

export default InvestmentOverview;
