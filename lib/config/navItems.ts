import type { MainNavItem, NavConfig } from "@/types/app";

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "home",
      href: "/",
    },
    {
      title: "products",
      href: "/products",
    },
    {
      title: "cart",
      href: "/cart",
    },
    {
      title: "checkout",
      href: "/checkout",
    },
    {
      title: "orders",
      href: "/orders",
    },
  ] as MainNavItem[],
};
