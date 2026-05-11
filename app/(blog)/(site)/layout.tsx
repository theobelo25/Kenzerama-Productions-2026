import SiteFrame from "@/components/layout/site-frame";
import BlogMain from "../main";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteFrame rootClassName="h-screen">
      <BlogMain>{children}</BlogMain>
    </SiteFrame>
  );
}
