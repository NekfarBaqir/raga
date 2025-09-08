import "@/app/globals.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/layouts/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col justify-start items-start">
     <header className="w-full flex-0"> <Header /></header>
     <main className="w-full flex-1 h-fit overflow-x-hidden" > {children}</main>
     <footer className="w-full flex-0"> <Footer /></footer>
    </div>
  );
}
