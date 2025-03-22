"use client";

import type { ProductWithDetails } from "@/data/data-access/products.queries";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
  items: ProductWithDetails[];
  addItem: (data: ProductWithDetails) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: ProductWithDetails) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return;
        }

        set({ items: [...currentItems, data] });
      },
      removeItem: (id: string) => {
        const currentItems = get().items;
        set({ items: currentItems.filter((item) => item.id !== id) });
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
