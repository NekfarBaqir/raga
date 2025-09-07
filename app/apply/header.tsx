"use client";

import { useState } from "react";
import { sideConfig } from "@/config/site";
import Logo from "@/icons/logo";
import { MainNavItem } from "@/types";
import { usePathname } from "next/navigation";
import NavItem from "../../components/ui/nav-item";
import { Menu, X } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <header className="w-full py-2 px-4 lg:px-10 flex justify-between items-center bg-white dark:bg-black shadow-md relative">
      <Logo className="w-[100px] lg:w-[175px] h-auto" />

      <nav className="hidden lg:flex justify-center items-center gap-8">
        {sideConfig.mainNav.map((item: MainNavItem) => {
          const active = pathname === item.href;
          return (
            <NavItem
              key={item.href}
              href={item.href}
              svg={item.svg}
              disabled={item.disabled}
              title={item.title}
              active={active}
            />
          );
        })}
      </nav>

      <button
        className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        onClick={toggleMobileMenu}
        aria-label="Toggle Menu"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-black shadow-lg lg:hidden z-50">
          <nav className="flex flex-col py-4 gap-2 px-4">
            {sideConfig.mainNav.map((item: MainNavItem) => {
              const active = pathname === item.href;
              return (
                <NavItem
                  key={item.href}
                  href={item.href}
                  svg={item.svg}
                  disabled={item.disabled}
                  title={item.title}
                  active={active}
                  onClick={(): void => setMobileOpen(false)}
                />
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
