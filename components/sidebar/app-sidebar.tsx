"use client";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { StoreType } from "@/drizzle/schema/store";
import {
  BarChart,
  GalleryHorizontalEnd,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingBag,
  Sliders,
  Store,
  Users,
} from "lucide-react";
import type { User } from "next-auth";
import type * as React from "react";
import { StoreSwitcher } from "./store-switcher";

const getDashboardNavItems = (storeId: string) => [
  {
    title: "Overview",
    url: `/admin/${storeId}`,
    icon: LayoutDashboard,
  },
  {
    title: "Billboards",
    url: `/admin/${storeId}/billboards`,
    icon: GalleryHorizontalEnd,
  },
  {
    title: "Products",
    url: `/admin/${storeId}/products`,
    icon: Package,
    items: [
      {
        title: "All Products",
        url: `/admin/${storeId}/products`,
      },
      {
        title: "Categories",
        url: `/admin/${storeId}/products/categories`,
      },
      {
        title: "Inventory",
        url: `/admin/${storeId}/products/inventory`,
      },
    ],
  },
  {
    title: "Orders",
    url: `/admin/${storeId}/orders`,
    icon: ShoppingBag,
    items: [
      {
        title: "All Orders",
        url: `/admin/${storeId}/orders`,
      },
      {
        title: "Abandoned Carts",
        url: `/admin/${storeId}/orders/abandoned`,
      },
    ],
  },
  {
    title: "Customers",
    url: `/admin/${storeId}/customers`,
    icon: Users,
    items: [
      {
        title: "All Customers",
        url: `/admin/${storeId}/customers`,
      },
      {
        title: "Customer Groups",
        url: `/admin/${storeId}/customers/groups`,
      },
    ],
  },
  {
    title: "Analytics",
    url: `/admin/${storeId}/analytics`,
    icon: BarChart,
  },
  {
    title: "Settings",
    url: `/admin/${storeId}/settings`,
    icon: Settings2,
  },
  {
    title: "Advanced Settings",
    url: `/admin/${storeId}/settings/advanced`,
    icon: Sliders,
    items: [
      {
        title: "General",
        url: `/admin/${storeId}/settings`,
      },
      {
        title: "Payments",
        url: `/admin/${storeId}/settings/payments`,
      },
      {
        title: "Shipping",
        url: `/admin/${storeId}/settings/shipping`,
      },
      {
        title: "Taxes",
        url: `/admin/${storeId}/settings/taxes`,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <StoreSwitcher stores={formattedStores} activeStoreId={currentStoreId} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
