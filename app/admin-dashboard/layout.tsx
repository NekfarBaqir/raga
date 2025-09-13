"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/dash-component/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/dash-component/site-header";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: string = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
