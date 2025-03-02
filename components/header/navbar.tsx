import ThemeToggle from "../common/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Nav } from "./nav";
import { StoreSwitcher } from "./store-switcher";
import { UserNav } from "./user-nav";
import { getAllStoresByUserId } from "@/lib/helper/store-helper";
import React from "react";

const Navbar = async () => {
  const stores = await getAllStoresByUserId();

  return (
    <div className="bg-background border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <StoreSwitcher items={stores} />
        </div>
        <Nav
          containerStyles="hidden items-center gap-6 md:flex"
          linkStyles="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          underlineStyles="absolute left-0 top-full h-[2px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-200 group-hover:scale-x-100"
        />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
          <ThemeToggle />
          <MobileNav className="md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
