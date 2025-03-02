"use client";

import { MotionSpan } from "@/components/common/MontionComp";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

interface NavProps {
  containerStyles?: string;
  linkStyles?: string;
  underlineStyles?: string;
  onLinkClick?: () => void;
}

export function Nav({ containerStyles, linkStyles, underlineStyles, onLinkClick }: NavProps) {
  const path = usePathname();
  const params = useParams();

  const routes = useMemo(() => {
    return [
      {
        href: `/${params.storeId}/settings`,
        label: "settings",
        isActive: path === `/${params.storeId}/settings`,
      },
    ];
  }, [params.storeId, path]);

  return (
    <nav className={containerStyles}>
      {routes.map((route) => {
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn("group relative py-2 transition-colors", linkStyles, route.isActive && "text-foreground")}
            onClick={() => onLinkClick?.()}
            aria-current={route.isActive ? "page" : undefined}
          >
            <span className="relative text-lg">
              {route.label.charAt(0).toUpperCase() + route.label.slice(1)}
              {route.isActive && (
                <MotionSpan
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                  layoutId="nav-underline"
                  className={cn("absolute -bottom-2", underlineStyles)}
                />
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
