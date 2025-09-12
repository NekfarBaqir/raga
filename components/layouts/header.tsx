"use client";

import { sideConfig } from "@/config/site";
import { useDimensions } from "@/hooks/use-dimensions";
import Logo from "@/icons/logo";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import { motion, useCycle } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { ShimmerButton } from "../magicui/shimmer-button";
import NavItem from "../ui/nav-item";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import { useUser } from "@auth0/nextjs-auth0";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { LayoutDashboard, LogOut } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@auth0/nextjs-auth0";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
    backgroundColor: "rgba(255, 255, 255, 1)",
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
    backgroundColor: "rgba(255, 255, 255, 0)",
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

const Header = () => {
  const [role, setRole] = useState<string | null>(null);
  const { user } = useUser();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef<HTMLElement>(null);
  const { height } = useDimensions(containerRef as RefObject<HTMLElement>);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const decoded: any = jwtDecode(token);
          const roles: string[] = decoded["https://raga.space/roles"] || [];
          setRole(roles[0] || "user");
        } else {
          setRole("user");
        }
      } catch (err) {
        console.error(err);
        setRole("user");
      }
    };

    fetchRole();
  }, []);

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
        <Link href="/" className="cursor-pointer">
          <Logo className="w-[100px] lg:w-[175px] !h-fit" />
        </Link>

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
                key={idx}
              />
            );
          })}
        </nav>

        <div>
          {!user ? (
            <div className="justify-end items-center hidden md:flex">
              {!pathname?.includes("apply") && (
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
              )}
            </div>
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

        <div className="md:hidden">
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
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => toggleOpen()}
        />
      )}
    </>
  );
};

export default Header;
