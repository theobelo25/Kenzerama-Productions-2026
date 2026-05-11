import Link from "@/components/navigation/link-component";
import StatusPageShell from "@/components/layout/status-page-shell";
import { Button } from "@/components/ui/button";

export default function NotFoundFallback() {
  return (
    <StatusPageShell>
      <h1 className="mb-4 text-3xl font-bold">Not Found</h1>
      <p className="text-destructive">Could not find the requested page</p>
      <Button variant="outline" className="mt-4" asChild>
        <Link href="/" withTransition>
          Back to Home
        </Link>
      </Button>
    </StatusPageShell>
  );
}
