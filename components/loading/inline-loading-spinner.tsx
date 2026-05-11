import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "size-3 border-2",
  md: "size-6 border-2",
  lg: "size-10 border-[3px]",
} as const;

export type InlineLoadingSpinnerSize = keyof typeof sizeStyles;

type Props = {
  className?: string;
  /** Default `sm` matches `TransitionLoadingIndicator` in root layout. */
  size?: InlineLoadingSpinnerSize;
};

/** White ring spinner — same visual as the root layout route transition loader. */
export default function InlineLoadingSpinner({
  className,
  size = "sm",
}: Props) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-white/30 border-t-white",
        sizeStyles[size],
        className,
      )}
      aria-hidden
    />
  );
}
