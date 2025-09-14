"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  MessageCircle,
  ChartColumn,
  CircleQuestionMark,
  Inbox,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/icons/logo";
import { NavUser } from "@/components/dash-component/nav-user";
import { useUser } from "@auth0/nextjs-auth0";

const navMain = [
  {
    title: "Insight",
    url: "/admin-dashboard",
    icon: ChartColumn,
  },
  {
    title: "Questions",
    url: "/admin-dashboard/questions",
    icon: CircleQuestionMark,
  },
  {
    title: "Submissions",
    url: "/admin-dashboard/submissions",
    icon: FileText,
  },
  {
    title: "Contact",
    url: "/admin-dashboard/contacts",
    icon: MessageCircle,
  },
];

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  if (isLoading) return null;

  const userData = {
    name: user?.name || "Guest",
    email: user?.email || "guest@example.com",
    avatar: user?.picture || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link href="/" className="">
          <Logo className="w-60 -mt-14 -mb-10 " />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navMain.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`flex items-center py-6 mt-2 gap-3 p-3 rounded-md text-base transition-colors ${
                      isActive ? "bg-popover text-foreground" : ""
                    }`}
                  >
                    <item.icon className="!size-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
