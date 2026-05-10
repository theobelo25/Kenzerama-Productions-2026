"use client";

import dynamic from "next/dynamic";
import type { PageTestimonial } from "@/lib/actions/directus.actions";
import type { TestimonialsProps } from "@/lib/directus/blocks/block_testimonials";

const Testimonials = dynamic(() => import("./testimonials"), {
  ssr: false,
});

type Props = {
  /** From {@link testimonialsFromBlockItem} / `BLOCKS.TESTIMONIALS`. */
  data?: TestimonialsProps | null;
  /** Raw rows when not using the testimonials block (e.g. legacy page fields). */
  testimonials?: PageTestimonial[];
};

const TestimonialsClient = ({ data, testimonials }: Props) => {
  const cmsTestimonials =
    data?.testimonials?.length ? data.testimonials : testimonials;

  return <Testimonials cmsTestimonials={cmsTestimonials} />;
};

export default TestimonialsClient;
