"use client";

import { useState } from "react";
import { BarChart3, HelpCircle, Inbox, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/icons/logo";

export default function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: "insight" | "questions" | "submissions";
  setActiveTab: (tab: "insight" | "questions" | "submissions") => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { icon: BarChart3, label: "Insight", value: "insight" },
    { icon: HelpCircle, label: "Questions", value: "questions" },
    { icon: Inbox, label: "Submissions", value: "submissions" },
  ] as const;

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
              key={tab.value}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
            />
          ))}
        </nav>
        <div className="p-4 absolute bottom-4 ">
          <div className="flex items-center justify-between">
            <SidebarItem
              label="Logout"
              icon={LogOut}
              onClick={() => (window.location.href = "/auth/logout")}
            />
          </div>
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
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-accent"
              >
                <div className="flex items-center justify-center">
                  <Logo className="w-40 h-40 -mt-12 -mb-14 mr-7" />
                </div>
              </button>
            </div>
            <nav className="flex flex-col gap-1 mt-2">
              {tabs.map((tab) => (
                <SidebarItem
                  key={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  active={activeTab === tab.value}
                  onClick={() => {
                    setActiveTab(tab.value);
                    setMobileOpen(false);
                  }}
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
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left",
      active
        ? "bg-accent text-accent-foreground font-medium"
        : "text-muted-foreground"
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);
