"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
};
