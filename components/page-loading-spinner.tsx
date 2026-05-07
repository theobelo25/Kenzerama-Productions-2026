import InlineLoadingSpinner from "@/components/inline-loading-spinner";

/** Compact loader for route `loading.tsx` — matches root layout transition indicator. */
export default function PageLoadingSpinner() {
  return (
    <div
      className="flex w-full justify-center py-16 md:py-20"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="pointer-events-none flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs text-white backdrop-blur-md">
        <InlineLoadingSpinner />
        <span className="font-questrial">Loading</span>
      </div>
    </div>
  );
}
