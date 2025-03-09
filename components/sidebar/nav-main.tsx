"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  // Helper function to determine if a route is active
  const isRouteActive = (url: string): boolean => {
    // Exact match
    if (pathname === url) return true;

    // Special case for Overview (store root)
    if (url.split('/').filter(Boolean).length === 2) {
      // Only match exactly for the store root to avoid highlighting Overview when on other pages
      return pathname === url;
    }

    // For other routes, check if pathname starts with the URL
    // But ensure we're matching complete segments to avoid partial matches
    // e.g., /store1/billboards should not match /store1/bill
    const urlSegments = url.split('/').filter(Boolean);
    const pathnameSegments = pathname.split('/').filter(Boolean);

    // Check if all URL segments are present in the pathname segments in the same order
    if (urlSegments.length > pathnameSegments.length) return false;

    for (let i = 1; i < urlSegments.length; i++) {
      if (urlSegments[i] !== pathnameSegments[i]) return false;
    }

    return true;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        { items.map((item) => {
          const isActive = isRouteActive(item.url);
          const hasSubItems = item.items && item.items.length > 0;

          // Check if any subitems are active
          const isAnySubItemActive = hasSubItems &&
            item.items!.some(subItem => isRouteActive(subItem.url));

          // For items without subitems, render a direct link
          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={ item.title }>
                <SidebarMenuSubButton className={ cn(isActive && "bg-accent text-accent-foreground", "py-4") } asChild>
                  <Link href={ item.url }>
                    <span>{ item.title }</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuItem>
            );
          }

          // For items with subitems, render a collapsible menu
          return (
            <Collapsible key={ item.title } asChild defaultOpen={ isActive || isAnySubItemActive } className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={ item.title }>
                    { item.icon && <item.icon className={ cn((isActive || isAnySubItemActive) ? "text-primary" : "text-muted-foreground") } /> }
                    <span>{ item.title }</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    { item.items?.map((subItem) => {
                      const isSubItemActive = isRouteActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={ subItem.title }>
                          <SidebarMenuSubButton
                            className={ cn(isSubItemActive && "bg-accent text-accent-foreground", "py-4") }
                            asChild
                          >
                            <Link href={ subItem.url }>
                              <span>{ subItem.title }</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    }) }
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }) }
      </SidebarMenu>
    </SidebarGroup>
  );
}
