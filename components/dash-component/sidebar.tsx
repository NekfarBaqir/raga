"use client";

import Logo from "@/icons/logo";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Contact as ContactIcon,
  HelpCircle,
  Inbox,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tabs = [
  { icon: BarChart3, label: "Insight", href: "/dashboard" },
  { icon: HelpCircle, label: "Questions", href: "/dashboard/questions" },
  { icon: Inbox, label: "Submissions", href: "/dashboard/submissions" },
  { icon: ContactIcon, label: "Contacts", href: "/dashboard/contacts" },
] as { icon: React.ComponentType<{ className?: string }>; label: string; href: string }[];

export default function Sidebar({ pathname }: { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="xl:hidden fixed top-0 left-0 right-0 z-50 bg-muted border-b p-3 flex items-center justify-between h-16">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Logo className="w-20 h-20 sm:w-24 sm:h-24" />
      </div>

      <aside className="hidden xl:flex  top-0 left-0 h-screen w-64 bg-muted border-r flex-col z-40">
        <div className="p-4">
          <Logo className="w-36 h-36  -mt-12 ml-4 -mb-14" />
        </div>
        <nav className="flex flex-col gap-2 p-3 flex-1">
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
        <div className="p-4">
          <Link
            href="/auth/logout"
            className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-accent hover:text-red-700 transition-colors w-full text-muted-foreground text-sm"
          >
            <span>Logout</span>
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden flex transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="bg-muted border-r w-64 h-full p-4 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <Logo className="w-32 h-32 -mt-12 ml-4 -mb-14" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <SidebarItem
                  key={tab.href}
                  icon={tab.icon}
                  label={tab.label}
                  href={tab.href}
                  active={pathname === tab.href}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="absolute bottom-4 w-full px-4">
              <Link
                href="/auth/logout"
                className="flex justify-between items-center px-4 py-2 rounded-md hover:bg-accent hover:text-red-700 transition-colors w-full text-muted-foreground text-sm"
                onClick={() => setMobileOpen(false)}
              >
                <span>Logout</span>
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
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
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-full text-sm",
      active
        ? "bg-accent text-accent-foreground font-medium"
        : "text-muted-foreground"
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </Link>
);
