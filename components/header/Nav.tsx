"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MotionSpan } from "@/components/common/MontionComp";
import type { CategoryWithBillboard } from "@/data/data-access/category.queries";
import { cn } from "@/lib/utils";

interface NavProps {
  containerStyles?: string;
  linkStyles?: string;
  underlineStyles?: string;
  onLinkClick?: () => void;
  data: CategoryWithBillboard[];
}

export function Nav({ containerStyles, linkStyles, underlineStyles, onLinkClick, data }: NavProps) {
  const pathname = usePathname();

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  return (
    <nav className={containerStyles}>
      {routes.map((route) => {
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group relative py-2 transition-colors",
              linkStyles,
              route.active && "text-foreground",
            )}
            onClick={() => onLinkClick?.()}
            aria-current={route.active ? "page" : undefined}
          >
            <span className="relative text-lg">
              {route.label.charAt(0).toUpperCase() + route.label.slice(1)}
              {route.active && (
                <MotionSpan
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                  layoutId="nav-underline"
                  className={cn("-bottom-2 absolute", underlineStyles)}
                />
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
