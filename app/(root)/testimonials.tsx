import Image from "next/image";
import DG from "@/public/images/d-and-g-review-image.webp";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-8">
      <h2 className="sr-only">Testimonials</h2>
      <div className="wrapper grid grid-cols-1 md:grid-cols-5">
        <div className="md:flex md:flex-col md:justify-center pt-10 md:pt-0 md:pr-10 col-span-1 md:col-span-4">
          <h3 className="relative text-right text-xl font-questrial after:content-[''] after:absolute after:right-0 after:-bottom-1 after:bg-kenzerama-pink after:w-[80%] after:h-px">
            See what our clients are saying!
          </h3>
          <blockquote className="text-center font-questrial py-10">
            100% would recommend Kenzerama Productions! My husband and I hired
            them for our wedding back in May and we are completely blown away by
            the final product! Our wedding video turned out like cinematic
            magical dream! Kenzie and Theo were absolutely amazing to work with!
            They were knowledgeable, provided expertise feedback on our ideas
            and worked with us to create our vision. They were professional,
            trustworthy, reliable and friendly. We were able to communicate with
            them seamlessly throughout the whole process. We are so happy with
            our decision and so grateful for the amazing work that they did!
          </blockquote>
        </div>
        <div className="max-md:order-first h-fit col-span-1 md:col-span-1 rounded-sm overflow-hidden">
          <Image src={DG} alt={"TENP"} />
        </div>
        <div className="flex justify-between items-center col-span-1 md:col-span-5 md:pt-10 w-full md:min-w-[400px] md:w-[50%] m-auto">
          <Button variant={"outline"}>
            <ArrowBigLeft />
          </Button>
          <span className="text-2xl font-cinzel">John & Jane</span>
          <Button variant={"outline"}>
            <ArrowBigRight />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
