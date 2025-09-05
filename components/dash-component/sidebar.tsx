"use client";

import {
  BarChart3,
  HelpCircle,
  Inbox,
  Contact as ContactIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/icons/logo";
import Link from "next/link";
import { useState } from "react";

const tabs = [
  { icon: BarChart3, label: "Insight", href: "/dashboard" },
  { icon: HelpCircle, label: "Questions", href: "/dashboard/questions" },
  { icon: Inbox, label: "Submissions", href: "/dashboard/submissions" },
  { icon: ContactIcon, label: "Contacts", href: "/dashboard/contacts" },
] as const;

export default function Sidebar({ pathname }: { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="md:hidden p-4 bg-muted border-b">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md hover:bg-accent"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <aside className="hidden md:flex w-64 bg-muted border-r flex-col relative">
        <div className="p-4 font-bold text-xl">
          <Logo className="w-40 h-40 -mt-12 ml-4 -mb-14" />
        </div>
        <nav className="flex flex-col gap-1 p-2">
          {tabs.map((tab) => (
            <SidebarItem
              key={tab.href}
              icon={tab.icon}
              label={tab.label}
              href={tab.href}
              active={pathname === tab.href}
            />
          ))}
        </nav>
        <div className="p-4 absolute bottom-4 w-full">
          <Link
            href="/auth/logout"
            className="flex justify-between items-center px-4 py-2 rounded-sm hover:bg-accent  hover:text-red-700 transition-colors w-full text-muted-foreground"
          >
            <span>Logout</span>
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 md:hidden flex"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="bg-muted p-4 border-r w-64 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <Logo className="w-32 h-32 -mt-6 -mb-8" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-accent"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 mt-2">
              {tabs.map((tab) => (
                <SidebarItem
                  key={tab.href}
                  icon={tab.icon}
                  label={tab.label}
                  href={tab.href}
                  active={pathname === tab.href}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full",
      active
        ? "bg-accent text-accent-foreground font-medium"
        : "text-muted-foreground"
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);
