"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import ThemeToggle from "@/components/common/theme-toggle";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";
import { UserNav } from "./user-nav";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
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
      className={ cn(
        "sticky inset-x-0 top-0 z-30 w-full border-b transition-all duration-300",
        isScrolled ? "border-border/40 bg-background/80 backdrop-blur-lg" : "border-transparent bg-background/0",
        className
      ) }
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <Image
                src="/logo.png"
                alt={ siteConfig.name }
                quality={ 100 }
                width={ 32 }
                height={ 32 }
                priority
                className="rounded-lg transition-opacity duration-300"
              />
              <span className="hidden font-medium sm:inline-block">{ siteConfig.name }</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Nav
              containerStyles="hidden items-center gap-6 md:flex"
              linkStyles="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              underlineStyles="absolute left-0 top-full h-[2px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-200 group-hover:scale-x-100"
            />

            <div className="flex items-center gap-2">
              <UserNav />
              <ThemeToggle />
              <MobileNav className="md:hidden" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
