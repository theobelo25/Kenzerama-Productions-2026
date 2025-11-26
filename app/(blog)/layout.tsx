import Header from "@/components/shared/header";
import Footer from "@/components/footer";
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[180px] md:pt-[126px]">{children}</main>
      <Footer />
    </div>
  );
}
