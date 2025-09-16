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
      <Header/>
     <main className="w-full flex-1 h-fit overflow-x-hidden pb-20" > {children}</main>
     <footer className="w-full flex-0"> <Footer /></footer>
    </div>
  );
}
