"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IconButton from "@/components/ui/icon-button";
import type { ColorType, SizeType } from "@/drizzle/schema/store";
import Filter from "./filter";

interface MobileFiltersProps {
  sizes: SizeType[];
  colors: ColorType[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-x-2 lg:hidden">
        Filters
        <Plus size={20} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed top-0 right-0 h-full w-full max-w-xs rounded-none lg:hidden">
          <div className="flex items-center justify-end px-4">
            <IconButton icon={<X size={15} />} onClick={() => setOpen(false)} />
          </div>
          <div className="p-4">
            <Filter valueKey="sizeId" name="Sizes" data={sizes} />
            <Filter valueKey="colorId" name="Colors" data={colors} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileFilters;
