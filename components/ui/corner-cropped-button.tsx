"use client";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CornerCroppedButton = ({
  children,
  className = "",
  backgroundClassName = "",
  onClick,
  link,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  link: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const theme = useTheme();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const clickHandler = () => {
    if (onClick) {
      onClick();
      return;
    }
    router?.push(link);
  };
  return (
    <button
      className={cn(
        "relative cursor-pointer text-foreground aspect-[177/60] text-xs leading-0 flex justify-center items-center group py-2 px-3 min-w-[100px] gap-1.5 hover:text-primary",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={clickHandler}
    >
      <svg
        viewBox="0 0 179 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("absolute inset-0", backgroundClassName)}
      >
        <path
          opacity="0.3"
          d="M178.37 48.5008L165.87 61.001H13.5002L1 48.5008V13.5002L13.5002 1H165.87L178.37 13.5002V48.5008Z"
          stroke={isHovered ? "#B71C1C" : theme === "light" ? "black" : "white"}
          strokeWidth={isHovered ? "1.50020" : "1.00002"}
        />
      </svg>

      {children}
      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all duration-300" />
    </button>
  );
};

export default CornerCroppedButton;
