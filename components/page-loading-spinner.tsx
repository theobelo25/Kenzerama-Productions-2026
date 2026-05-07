import Image from "next/image";
import loader from "@/assets/fade-stagger-circles.svg";

/** Compact loader for route `loading.tsx` files — avoids full-viewport height jumps vs real pages. */
export default function PageLoadingSpinner() {
  return (
    <div
      className="flex w-full justify-center py-16 md:py-20"
      aria-busy="true"
      aria-live="polite"
    >
      <Image
        src={loader}
        alt="Loading"
        width={120}
        height={120}
        className="shrink-0"
        priority
      />
    </div>
  );
}
