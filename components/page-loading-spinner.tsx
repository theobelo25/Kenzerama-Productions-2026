import LoadingPill from "@/components/loading-pill";

/** Compact loader for route `loading.tsx` — matches root layout transition indicator. */
export default function PageLoadingSpinner() {
  return (
    <div
      className="flex w-full justify-center py-16 md:py-20"
      aria-busy="true"
      aria-live="polite"
    >
      <LoadingPill />
    </div>
  );
}
