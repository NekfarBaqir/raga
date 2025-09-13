"use client";

import { sideConfig } from "@/config/site";
import { MainNavItem } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ShimmerButton } from "../magicui/shimmer-button";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

interface NavigationProps {
  onItemClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onItemClick }) => {
  const pathname = usePathname();

  return (
    <motion.div className="absolute top-0 left-0 bottom-0 w-full p-6 pt-20">
      <motion.ul variants={variants} className="space-y-2">
        {sideConfig.mainNav.map((item: MainNavItem, idx: number) => {
          const isActive = pathname === item.href;
          return (
            <MenuItem
              key={idx}
              item={item}
              isActive={isActive}
              onItemClick={onItemClick}
            />
          );
        })}
        
        {/* Apply Now Button */}
        {!pathname?.includes("apply") && (
          <motion.li
            variants={{
              open: {
                y: 0,
                opacity: 1,
                transition: {
                  y: { stiffness: 1000, velocity: -100 }
                }
              },
              closed: {
                y: 50,
                opacity: 0,
                transition: {
                  y: { stiffness: 1000 }
                }
              }
            }}
            className="pt-4"
          >
            <Link href="/apply" onClick={onItemClick}>
              <ShimmerButton
                background="black"
                shimmerColor="#fff"
                className="!p-3 !px-6 dark:text-foreground text-background !border border-black/20 cursor-pointer hover:border-black/40 transition-all duration-300 w-full"
              >
                Apply Now
              </ShimmerButton>
            </Link>
          </motion.li>
        )}
      </motion.ul>
    </motion.div>
  );
};