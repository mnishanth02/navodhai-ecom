"use client";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import type { ColorType, SizeType } from "@/drizzle/schema/store";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { toast } from "sonner";

interface FilterProps {
  data: (SizeType | ColorType)[];
  name: string;
  valueKey: string;
}

const Filter: React.FC<FilterProps> = ({ data, name, valueKey }) => {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useQueryState(valueKey);

  const selectedValues = selectedValue ? selectedValue.split(",").filter(Boolean) : [];

  const onClick = useCallback(
    async (id: string) => {
      try {
        const newValues = selectedValues.includes(id)
          ? selectedValues.filter((value) => value !== id)
          : [...selectedValues, id];

        await setSelectedValue(newValues.length > 0 ? newValues.join(",") : null);
        router.refresh();
      } catch {
        toast.error("Failed to update filter. Please try again.");
      }
    },
    [selectedValues, setSelectedValue, router],
  );

  const clearFilters = useCallback(async () => {
    try {
      await setSelectedValue(null);
      router.refresh();
    } catch {
      toast.error("Failed to update filter. Please try again.");
    }
  }, [setSelectedValue, router]);

  return (
    <div className="space-y-4 rounded-lg bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-xl">{name}</h3>
        {selectedValues.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => {
          const isSelected = selectedValues.includes(filter.id);
          return (
            <Button
              key={filter.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onClick(filter.id)}
              className={cn(
                "min-w-20 rounded-full border transition-colors",
                isSelected
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-background hover:bg-muted",
              )}
            >
              {filter.name}
              {isSelected && (
                <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs">
                  Active
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
