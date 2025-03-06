"use client";

import { StoreSwitcher } from "./store-switcher";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { StoreType } from "@/drizzle/schema/store";
import { BarChart, LayoutDashboard, Package, Settings2, ShoppingBag, Sliders, Store, Users } from "lucide-react";
import { User } from "next-auth";
import * as React from "react";

const getDashboardNavItems = (storeId: string) => [
  {
    title: "Overview",
    url: `/${storeId}`,
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Products",
    url: `/${storeId}/products`,
    icon: Package,
    items: [
      {
        title: "All Products",
        url: `/${storeId}/products`,
      },
      {
        title: "Categories",
        url: `/${storeId}/products/categories`,
      },
      {
        title: "Inventory",
        url: `/${storeId}/products/inventory`,
      },
    ],
  },
  {
    title: "Orders",
    url: `/${storeId}/orders`,
    icon: ShoppingBag,
    items: [
      {
        title: "All Orders",
        url: `/${storeId}/orders`,
      },
      {
        title: "Abandoned Carts",
        url: `/${storeId}/orders/abandoned`,
      },
    ],
  },
  {
    title: "Customers",
    url: `/${storeId}/customers`,
    icon: Users,
    items: [
      {
        title: "All Customers",
        url: `/${storeId}/customers`,
      },
      {
        title: "Customer Groups",
        url: `/${storeId}/customers/groups`,
      },
    ],
  },
  {
    title: "Analytics",
    url: `/${storeId}/analytics`,
    icon: BarChart,
  },
  {
    title: "Settings",
    url: `/${storeId}/settings`,
    icon: Settings2,
  },
  {
    title: "Advanced Settings",
    url: `/${storeId}/settings/advanced`,
    icon: Sliders,
    items: [
      {
        title: "General",
        url: `/${storeId}/settings`,
      },
      {
        title: "Payments",
        url: `/${storeId}/settings/payments`,
      },
      {
        title: "Shipping",
        url: `/${storeId}/settings/shipping`,
      },
      {
        title: "Taxes",
        url: `/${storeId}/settings/taxes`,
      },
    ],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
  stores: StoreType[];
  currentStoreId: string;
}

export function AppSidebar({ user, stores, currentStoreId, ...props }: AppSidebarProps) {
  // Format stores for the team switcher
  const formattedStores = stores.map((store) => ({
    name: store.name,
    logo: Store,
    plan: "Store",
    id: store.id,
  }));

  // Get navigation items for the current store
  const navItems = getDashboardNavItems(currentStoreId);

  return (
    <Sidebar collapsible="icon" { ...props }>
      <SidebarHeader>
        <StoreSwitcher stores={ formattedStores } activeStoreId={ currentStoreId } />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ navItems } />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={ user } />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
