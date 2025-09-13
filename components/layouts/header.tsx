"use client";

import { sideConfig } from "@/config/site";
import { useDimensions } from "@/hooks/use-dimensions";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import { useUser } from "@auth0/nextjs-auth0";
import { motion, useCycle } from "framer-motion";
import { ArrowRightIcon, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { AnimatedThemeToggler } from "../magicui/animated-theme-toggler";
import { ShimmerButton } from "../magicui/shimmer-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NavItem from "../ui/nav-item";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";



const Header = () => {
  const [role, setRole] = useState<string>("user");
  const theme = useTheme();
  const { user } = useUser();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef<HTMLElement>(null);
  const { height } = useDimensions(containerRef as RefObject<HTMLElement>);
  const router = useRouter();
  const pathname = usePathname();



  const sidebar = useMemo(() => {
    return {
      open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
        backgroundColor: theme === "light" ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)",
        transition: {
          clipPath: {
            type: "spring" as const,
            stiffness: 20,
            restDelta: 2,
          },
        },
      }),
      closed: {
        clipPath: "circle(20px at calc(100% - 32px) 30px)",
        backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)",
        transition: {
          clipPath: {
            delay: 0.5,
            type: "spring" as const,
            stiffness: 400,
            damping: 40,
          },
          backgroundColor: {
            duration: 0.1,
            delay: 0.8,
          },
        },
      },
    };
  }, [theme]);


  useEffect(() => {
    const roles = (user as any)?.["https://raga.space/roles"] as
      | string[]
      | undefined;
    setRole(roles?.[0] ?? "user");
  }, [user]);

  const goToDashboard = () => {
    if (role === "admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/user-dashboard");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header className="w-full h-fit py-0   max-h-[50px] md:max-h-[70px] md:py-2 px-5 flex justify-between items-center gap-2 max-w-[1800px] mx-auto relative z-40">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex w-full justify-center items-center gap-8">
          {sideConfig.mainNav.map((item: MainNavItem, idx: number) => {
            const active = pathname === item.href;
            return (
              <NavItem
                href={item.href}
                svg={item.svg}
                disabled={item.disabled}
                title={item.title}
                active={active}
                key={item.href || item.title || String(idx)}
              />
            );
          })}
        </nav>

        {/* Desktop Right Section */}
        <div className="justify-end items-center hidden md:flex">
          <AnimatedThemeToggler className="cursor-pointer mx-3" />
          {!user ? (
            !pathname?.includes("apply") && (
              <Link href="/auth/login?returnTo=/apply">
                <ShimmerButton
                  background="white"
                  shimmerColor="#000"
                  className="!p-3 !px-6 group text-foreground !border border-black/10 cursor-pointer hover:border-black/20 transition-all duration-300"
                >
                  Apply Now
                  <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </ShimmerButton>
              </Link>
            )
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    className="rounded-full w-16"
                    src={user.picture || ""}
                    alt={user.name || ""}
                  />
                  <AvatarFallback className="rounded-full border p-4 ">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 py-4 mt-3">
                <DropdownMenuItem
                  onClick={goToDashboard}
                  className="cursor-pointer px-4 py-2 flex items-center justify-between gap-2"
                >
                  <span>Dashboard</span>
                  <LayoutDashboard className="w-4 h-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer px-4 py-2 mt-3 flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <Link
                    href="/auth/logout"
                    className="flex items-center justify-between gap-2"
                  >
                    <span>Sign out</span>
                    <LogOut className="w-4 h-4" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="md:hidden flex justify-end items-center gap-1.5 w-full p-2 py-3">
        <AnimatedThemeToggler className="cursor-pointer mx-3" />
          <MenuToggle toggle={() => toggleOpen()} isOpen={isOpen} />
        </div>
      </header>

      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        className="fixed top-0 right-0 bottom-0 w-80 md:hidden z-30"
      >
        <motion.div
          className={cn("absolute top-0 right-0 bottom-0 w-full shadow-2xl")}
          variants={sidebar}
        />
        <Navigation onItemClick={() => toggleOpen()} />
      </motion.nav>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/20 z-20 md:hidden"
          onClick={() => toggleOpen()}
        />
      )}
    </>
  );
};

export default Header;
