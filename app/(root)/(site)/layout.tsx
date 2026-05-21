import SiteFrame from "@/components/layout/site-frame";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteFrame mainClassName="pt-[76px]">{children}</SiteFrame>;
}
