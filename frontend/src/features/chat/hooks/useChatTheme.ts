"use client";

import { useEffect, useState, useCallback } from "react";
import { Theme, UseChatThemeReturn } from "@/types/chat";

export function useChatTheme(): UseChatThemeReturn {
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("lumes_theme") as Theme | null;
    if (savedTheme === "light") {
      setTimeout(() => {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }, 0);
    } else {
      setTimeout(() => {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }, 0);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("lumes_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("lumes_theme", "light");
      }
      return nextTheme;
    });
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  };
}
