"use client";
import { usePathname } from "next/navigation";

const PageTitle = ({ title }: { title: string }) => {
  const pathname = usePathname();

  return (
    <section className={`flex flex-col text-center overflow-hidden min-h-fit`}>
      <h1 className="py-5 text-kenzerama-pink text-2xl md:text-3xl lg:text-4xl font-cinzel uppercase">
        {title}
      </h1>
    </section>
  );
};

export default PageTitle;
