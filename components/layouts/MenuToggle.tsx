"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import * as React from "react";

interface MenuToggleProps {
  toggle: () => void;
  isOpen: boolean;
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => (
  <button 
    onClick={toggle}
    className="outline-none border-none cursor-pointer w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center relative z-50"
    aria-label="Toggle menu"
  >
    <motion.div
      initial={false}
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {isOpen ? (
        <X className="w-5 h-5 text-gray-700" />
      ) : (
        <Menu className="w-5 h-5 text-gray-700" />
      )}
    </motion.div>
  </button>
);