import PageTransition from "@/components/motion/page-transition";

export default function BlogTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageTransition className="flex flex-1 flex-col">{children}</PageTransition>
  );
}
