import "@/app/globals.css";
import Footer from "@/components/footer/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col justify-start items-start">
     <main className="w-full flex-1 h-fit overflow-x-hidden" > {children}</main>
     <footer className="w-full flex-0"> <Footer /></footer>
    </div>
  );
}
