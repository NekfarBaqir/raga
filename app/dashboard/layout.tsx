"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/dash-component/sidebar";
import Header from "@/components/dash-component/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: string = usePathname();

  return (
    <div className="flex h-screen">
      <Sidebar pathname={pathname} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
