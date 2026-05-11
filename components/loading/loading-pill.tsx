import InlineLoadingSpinner from "@/components/loading/inline-loading-spinner";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  label?: string;
};

export default function LoadingPill({
  className,
  label = "Loading",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={cn(
        "pointer-events-none flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs text-white backdrop-blur-md",
        className,
      )}
    >
      <InlineLoadingSpinner />
      <span className="font-questrial">{label}</span>
    </div>
  );
}
