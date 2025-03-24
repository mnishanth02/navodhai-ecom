import Image from "next/image";
import Link from "next/link";

import ThemeToggle from "@/components/common/theme-toggle";
import { siteConfig } from "@/lib/config/site";

import { getAllCategoryByStoreIdQuery } from "@/data/data-access/category.queries";
import { env } from "@/data/env/server-env";
import { Suspense } from "react";
import Loader from "../common/loader";
import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";
import HeaderContainer from "./header-container";
import NaveBarActions from "./navbar-actions";
import { UserNav } from "./user-nav";

export async function Header() {
  const categories = await getAllCategoryByStoreIdQuery(env.APP_STORE_ID);

  return (
    <HeaderContainer>
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                quality={100}
                width={32}
                height={32}
                priority
                className="rounded-lg transition-opacity duration-300"
              />
              <span className="hidden font-medium sm:inline-block">{siteConfig.name}</span>
            </Link>
          </div>
          <Suspense fallback={<Loader />}>
            <div className="flex items-center gap-6">
              <Nav
                data={categories.success && categories.data ? categories.data : []}
                containerStyles="hidden items-center gap-6 md:flex"
                linkStyles="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                underlineStyles="absolute left-0 top-full h-[2px] w-full origin-left  bg-foreground transition-transform duration-200 "
              />

              <div className="flex items-center gap-2">
                <NaveBarActions />
                <UserNav />
                <ThemeToggle />
                <MobileNav
                  className="md:hidden"
                  categories={categories.success && categories.data ? categories.data : []}
                />
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </HeaderContainer>
  );
}
