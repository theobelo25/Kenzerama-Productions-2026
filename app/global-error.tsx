"use client";

import ErrorFallback from "@/components/layout/error-fallback";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <ErrorFallback error={error} reset={reset} />
        </div>
      </body>
    </html>
  );
}
