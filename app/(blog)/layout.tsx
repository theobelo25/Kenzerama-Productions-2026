import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main
        className={cn(
          "flex-1",
          pathname?.includes("/films/") ? "pt-17 md:pt-19" : "pt-45 md:pt-31.5"
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
