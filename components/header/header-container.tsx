"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface HeaderProps {
  className?: string;
  children: React.ReactNode;
}

const HeaderContainer = ({ className, children }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-30 w-full border-b transition-all duration-300",
        isScrolled
          ? "border-border/40 bg-background/80 backdrop-blur-lg"
          : "border-transparent bg-background/0",
        className,
      )}
    >
      {children}
    </header>
  );
};

export default HeaderContainer;
