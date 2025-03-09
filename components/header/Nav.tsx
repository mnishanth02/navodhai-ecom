"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MotionSpan } from "@/components/common/MontionComp";
import { navConfig } from "@/lib/config/navItems";
import { cn } from "@/lib/utils";

interface NavProps {
  containerStyles?: string;
  linkStyles?: string;
  underlineStyles?: string;
  onLinkClick?: () => void;
}

export function Nav({ containerStyles, linkStyles, underlineStyles, onLinkClick }: NavProps) {
  const path = usePathname();

  return (
    <nav className={ containerStyles }>
      { navConfig.mainNav.map((link) => {
        const isActive = path === link.href;

        return (
          <Link
            key={ link.href }
            href={ link.href }
            className={ cn("group relative py-2 transition-colors", linkStyles, isActive && "text-foreground") }
            onClick={ () => onLinkClick?.() }
            aria-current={ isActive ? "page" : undefined }
          >
            <span className="relative text-lg">
              { link.title.charAt(0).toUpperCase() + link.title.slice(1) }
              { isActive && (
                <MotionSpan
                  initial={ { y: "-100%" } }
                  animate={ { y: 0 } }
                  transition={ {
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  } }
                  layoutId="nav-underline"
                  className={ cn("absolute -bottom-2", underlineStyles) }
                />
              ) }
            </span>
          </Link>
        );
      }) }
    </nav>
  );
}
