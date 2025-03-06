"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useStoreModal } from "@/hooks/store/use-store-modal";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export function StoreSwitcher({
  stores,
  activeStoreId,
}: {
  stores: {
    name: string;
    logo: React.ElementType;
    plan: string;
    id: string;
  }[];
  activeStoreId?: string;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { onOpen } = useStoreModal();

  // Get active store directly from stores prop using useMemo
  const activeStore = React.useMemo(
    () => stores.find((store) => store.id === activeStoreId) || stores[0],
    [stores, activeStoreId]
  );

  const handleStoreSelect = (store: (typeof stores)[0]) => {
    router.push(`/${store.id}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeStore.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{ activeStore.name }</span>
                <span className="truncate text-xs">{ activeStore.plan }</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={ isMobile ? "bottom" : "right" }
            sideOffset={ 4 }
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Stores</DropdownMenuLabel>
            { stores.map((store) => (
              <DropdownMenuItem
                key={ store.id }
                onClick={ () => handleStoreSelect(store) }
                className={ `gap-2 p-2 ${store.id === activeStore.id ? "bg-muted" : ""}` }
              >
                <div className="flex size-6 items-center justify-center rounded-xs">
                  { activeStore.id === store.id && <Check className="size-4 shrink-0" /> }
                </div>
                { store.name }
              </DropdownMenuItem>
            )) }
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={ () => {
                onOpen();
              } }
            >
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Create Store</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
