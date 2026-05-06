"use client";

import dynamic from "next/dynamic";

const Testimonials = dynamic(() => import("./testimonials"), {
  ssr: false,
});

const TestimonialsClient = () => {
  return <Testimonials />;
};

export default TestimonialsClient;
