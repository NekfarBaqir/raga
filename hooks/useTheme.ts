"use client";

import { useEffect, useState } from "react";

export type ThemeName = "light" | "dark";

function getThemeFromDocument(): ThemeName {
  if (typeof document === "undefined") return "light";
  const root = document.documentElement;
  return root.classList.contains("dark") ? "dark" : "light";
}

export const useTheme = (): ThemeName => {
  const [theme, setTheme] = useState<ThemeName>("light");

  useEffect(() => {
    setTheme(getThemeFromDocument());

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(getThemeFromDocument());
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
};


