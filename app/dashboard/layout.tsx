

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div className="w-full flex flex-col justify-start ites">
    {/* sidebar */}
    {/* header */}
    {children}
   </div>
  );
}
