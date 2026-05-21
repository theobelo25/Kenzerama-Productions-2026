"use client";

import Link from "@/components/navigation/link-component";
import StatusPageShell from "@/components/layout/status-page-shell";
import { Button } from "@/components/ui/button";

type ErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <StatusPageShell>
      <h1 className="mb-4 text-3xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">
        We could not load this page. Please try again or return home.
      </p>
      {process.env.NODE_ENV === "development" && error.message ? (
        <p className="mt-4 text-sm text-destructive">{error.message}</p>
      ) : null}
      <div className="mt-6 flex justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" withTransition>
            Back to Home
          </Link>
        </Button>
      </div>
    </StatusPageShell>
  );
}
