"use client";
import { ConfigProvider, theme as antdTheme } from "antd";
import React, { useState, useEffect, createContext, ReactNode } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (t: string) => void;
  primaryColor: string;
  setPrimaryColor: (c: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  primaryColor: "#07377E",
  setPrimaryColor: () => {},
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("#07377E");

  // Restore from localStorage on first mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedColor = localStorage.getItem("primaryColor");
    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setPrimaryColor(savedColor);
  }, []);

  useEffect(() => {
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) =>
        setTheme(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, primaryColor, setPrimaryColor }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primaryColor,
            borderRadius: 2,
            colorBgContainer: theme === "dark" ? "#1a1a1a" : "#f6ffed",
          },
          algorithm:
            theme === "dark"
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
