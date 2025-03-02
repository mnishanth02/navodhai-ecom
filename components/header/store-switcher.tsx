"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StoreType } from "@/drizzle/schema/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useStoreModal } from "@/store/use-store-modal";
import { Check, ChevronsUpDown, Plus, Store, StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: StoreType[];
}

type Store = {
  value: string;
  label: string;
};
export function StoreSwitcher({ items = [] }: StoreSwitcherProps) {
  const formatedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [open, setOpen] = React.useState(false);
  const params = useParams();

  const currentStore = formatedItems.find((item) => item.value === params.storeId);

  const [selectedStore] = React.useState<Store | null>(currentStore || null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a store"
            className={cn("h-10 w-[180px] justify-between", !selectedStore && "text-muted-foreground")}
          >
            <Store className="mr-2 h-5 w-5" />
            {selectedStore ? <>{selectedStore.label}</> : <>Select Store</>}
            <ChevronsUpDown className="ml-auto h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StoreList setOpen={setOpen} currentStore={currentStore} items={formatedItems} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("h-10 w-[180px] justify-between", !selectedStore && "text-muted-foreground")}
        >
          <Store className="mr-2 h-5 w-5" />
          {selectedStore ? <>{selectedStore.label}</> : <>Select Store</>}
          <ChevronsUpDown className="ml-auto h-5 w-5 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle hidden>Select Store</DrawerTitle>
        <div className="mt-4 border-t">
          <StoreList setOpen={setOpen} currentStore={currentStore} items={formatedItems} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StoreList({
  setOpen,
  currentStore,
  items,
}: {
  setOpen: (open: boolean) => void;
  currentStore: Store | undefined;
  items: Store[];
}) {
  const router = useRouter();
  const storeModal = useStoreModal();

  const onStoreSelect = (store: Store) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };
  return (
    <Command>
      <CommandInput placeholder="Filter store..." />
      <CommandList>
        <CommandEmpty>No store found.</CommandEmpty>
        <CommandGroup>
          {items.map((store) => (
            <CommandItem
              className="h-10 cursor-pointer"
              key={store.value}
              value={store.value}
              onSelect={() => onStoreSelect(store)}
            >
              <StoreIcon className="mr-2 h-5 w-5" />
              {store.label}
              {currentStore?.value === store.value && <Check className="ml-auto h-5 w-5" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <CommandSeparator />
      <CommandList>
        <CommandGroup>
          <CommandItem
            className="h-10 cursor-pointer"
            onSelect={() => {
              setOpen(false);
              storeModal.onOpen();
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Store
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
