"use client";

import dynamic from "next/dynamic";
import type { TestimonialsProps } from "@/lib/directus/blocks/block_testimonials";

const Testimonials = dynamic(() => import("./testimonials"), {
  ssr: false,
});

type Props = {
  /** From {@link testimonialsFromBlockItem} / `BLOCKS.TESTIMONIALS`. */
  data: TestimonialsProps;
};

const TestimonialsClient = ({ data }: Props) => {
  return <Testimonials testimonials={data.testimonials} />;
};

export default TestimonialsClient;
