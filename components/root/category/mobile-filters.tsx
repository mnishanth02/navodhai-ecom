"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { ColorType, SizeType } from "@/drizzle/schema/store";
import Filter from "./filter";

interface MobileFiltersProps {
  sizes: SizeType[];
  colors: ColorType[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="flex items-center gap-x-2 lg:hidden">
          Filters
          <Plus size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="flex items-center justify-between border-b px-4 pb-4">
          <DrawerTitle className="font-semibold text-lg">Filters</DrawerTitle>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X size={18} />
          </Button>
        </DrawerHeader>
        <DrawerDescription hidden />
        <ScrollArea className="h-full">
          <div className="space-y-4 px-4 py-6">
            <div className="space-y-6">
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
              <Separator className="my-4" />
              <Filter valueKey="colorId" name="Colors" data={colors} />
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilters;
