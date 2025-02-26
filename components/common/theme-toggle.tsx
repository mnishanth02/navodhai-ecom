"use client";

import { Button } from "@ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative rounded-xl"
    >
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-0 transition-all dark:scale-100 dark:-rotate-90" />
      <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-90 transition-all dark:scale-0 dark:-rotate-0" />
    </Button>
  );
};

export default ThemeToggle;
