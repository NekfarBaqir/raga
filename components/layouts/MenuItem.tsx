"use client";

import { MainNavItem } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

const variants = {
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
};

interface MenuItemProps {
  item: MainNavItem;
  isActive: boolean;
  onItemClick: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, isActive, onItemClick }) => {
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="list-none mb-5 flex items-center cursor-pointer"
      onClick={onItemClick}
    >
      <Link 
        href={item.href} 
        className={`flex items-center w-full p-4 rounded-lg transition-colors duration-200 ${
          isActive 
            ? 'bg-background/10 text-primary font-semibold' 
            : ' hover:bg-background/5 hover:text-primary'
        }`}
      >
      
        <div className="flex-1">
          <div className="text-base font-medium">{item.title}</div>
        </div>
      </Link>
    </motion.li>
  );
};