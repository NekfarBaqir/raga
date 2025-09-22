"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconFileText, IconMessageUser } from "@tabler/icons-react";
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
import { NavUser } from "./nav-user";
import { useUser } from "@auth0/nextjs-auth0";
import { ChartGantt } from "lucide-react";

const navMain = [
  {
    title: "Dashboard",
    url: "/user-dashboard",
    icon: ChartGantt,
  },
  {
    title: "Contact",
    url: "/user-dashboard/contact",
    icon: IconMessageUser,
  },
  {
    title: "My Submission",
    url: "/user-dashboard/submissions",
    icon: IconFileText,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(true);

  if (isLoading) return null;

  const userData = {
    name: user?.name || "Guest",
    email: user?.email || "guest@example.com",
    avatar: user?.picture || "",
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={`sidebar-wrapper ${isOpen ? "open" : "closed"}`}>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <Link href="/" className="">
            <Logo className="w-60 -mt-14 -mb-10" />
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
                      onClick={handleLinkClick}
                      className={`flex items-center py-6 mt-2 gap-3 p-3 rounded-md text-base transition-colors ${isActive ? "bg-popover text-foreground" : ""
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
    </div>
  );
}
