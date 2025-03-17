"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, Pipette } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function ColorInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: Props<S>) {
  const form = useFormContext();
  const [colorValue, setColorValue] = useState<string>("");

  // Get the current value from the form
  useEffect(() => {
    const value = form.watch(nameInSchema as string);
    if (value) {
      // Ensure the color value has a # prefix if it doesn't already
      const formattedValue = value.startsWith("#") ? value : `#${value}`;
      setColorValue(formattedValue);
    }
  }, [form, nameInSchema]);

  // Handle color change from the color picker
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColorValue(newColor);
    form.setValue(nameInSchema as string, newColor, { shouldValidate: true, shouldDirty: true });
  };

  // Copy color value to clipboard
  const copyToClipboard = () => {
    if (colorValue) {
      navigator.clipboard
        .writeText(colorValue)
        .then(() => {
          // You could add a toast notification here if desired
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>

          <FormControl>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-x-2 sm:space-y-0">
              <div className="relative flex-1">
                <Input
                  id={nameInSchema}
                  className={cn("flex-1 pr-10", className)}
                  placeholder="#RRGGBB"
                  {...props}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-add # if user doesn't type it
                    const value = e.target.value;
                    const formattedValue = value.startsWith("#") ? value : `#${value}`;
                    setColorValue(formattedValue);
                  }}
                />
                {colorValue && (
                  <div
                    className="-translate-y-1/2 absolute top-1/2 right-2 h-6 w-6 rounded-full border"
                    style={{ backgroundColor: colorValue || "#ffffff" }}
                  />
                )}
              </div>
              <div className="flex items-center gap-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border transition-all hover:shadow-md"
                      style={{ backgroundColor: colorValue || "#ffffff" }}
                    >
                      <Pipette className="h-4 w-4 text-white mix-blend-difference" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Pick a color</span>
                      </div>
                      <input
                        type="color"
                        value={colorValue || "#ffffff"}
                        onChange={handleColorChange}
                        className="h-8 w-full cursor-pointer rounded-md"
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs">
                          {colorValue || "Select a color"}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={copyToClipboard}
                                className="rounded-sm p-1 hover:bg-muted"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy color code</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
