export default function FilmDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-14 md:pt-19 [overflow-anchor:none]">{children}</div>
  );
}
