import Header from "@/components/shared/header";
import Footer from "@/components/footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col ">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-[76px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
