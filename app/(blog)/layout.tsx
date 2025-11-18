import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import Sidebar from "./sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import BlogMenu from "@/components/shared/header/blog-menu";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Blog PAge Ideas
// Second Header for Category Browsing
// Recently Viewed
// Related Articles
// Link to google reviews? (Can I get them from API?)
