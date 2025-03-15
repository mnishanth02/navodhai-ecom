"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

import { Nav } from "./Nav";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-9 w-9 rounded-full", className)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-80 flex-col pr-0 sm:max-w-none">
        <SheetHeader className="flex-center px-1">
          <SheetTitle asChild>
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                quality={100}
                width={32}
                height={32}
                priority
                className="rounded-lg transition-opacity duration-300"
              />
              <span className="font-semibold">{siteConfig.name}</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex h-full flex-col justify-between px-1">
          <Nav
            containerStyles="flex flex-col flex-center space-y-3"
            linkStyles="text-muted-foreground hover:text-foreground transition-colors"
            underlineStyles="absolute left-0 top-full h-[2px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-200 group-hover:scale-x-100"
            onLinkClick={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
