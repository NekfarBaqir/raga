"use client";

import { sideConfig } from "@/config/site";
import Logo from "@/icons/logo";
import { MainNavItem } from "@/types";
import { usePathname } from "next/navigation";
import { ShimmerButton } from "../magicui/shimmer-button";
import NavItem from "../ui/nav-item";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full h-fit py-2 px-5 flex justify-between items-center gap-2 max-w-[1800px] mx-auto">
      <Logo className="w-[100px] lg:w-[175px] !h-fit" />
      <nav className="w-full flex justify-center items-center gap-8">
        {sideConfig.mainNav.map((item: MainNavItem, idx: number) => {
          const active = pathname === item.href;
          return (
            <NavItem
              href={item.href}
              svg={item.svg}
              disabled={item.disabled}
              title={item.title}
              active={active}
              key={idx}
            />
          );
        })}
      </nav>
      <div className="flex justify-end items-center">
        <Link href="/apply">
          <ShimmerButton
            background="white"
            shimmerColor="#000"
            className="!p-3 !px-6 text-foreground !border border-black/10 cursor-pointer hover:border-black/20 transition-all duration-300"
          >
            Apply Now
          </ShimmerButton>
        </Link>
      </div>
    </header>
  );
};

export default Header;
