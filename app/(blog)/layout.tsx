import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import BlogMain from "./main";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <BlogMain>
        {children}
        </BlogMain>
      </main>
      <Footer />
    </div>
  );
}
