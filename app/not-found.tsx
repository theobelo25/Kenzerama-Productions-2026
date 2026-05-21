import SiteNotFoundPage from "@/components/layout/site-not-found-page";
import { NOT_FOUND_METADATA } from "@/lib/seo/not-found-metadata";

export const metadata = NOT_FOUND_METADATA;

export default function NotFoundPage() {
  return <SiteNotFoundPage />;
}
