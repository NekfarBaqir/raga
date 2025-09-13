"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dash-component/app-sidebar";
import { SiteHeader } from "@/components/dash-component/site-header";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
