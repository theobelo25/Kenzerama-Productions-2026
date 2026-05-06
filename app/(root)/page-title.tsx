const PageTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <section className={`flex flex-col text-center overflow-hidden min-h-fit`}>
      <h1 className="pt-5 text-kenzerama-pink text-2xl md:text-3xl lg:text-4xl font-cinzel uppercase">
        {title}
      </h1>
      {subtitle && (
        <p className="pb-5 font-playfair-display text-black text-sm leading-snug md:text-base">
          {subtitle}
        </p>
      )}
    </section>
  );
};

export default PageTitle;
