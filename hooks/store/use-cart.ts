"use client";

import type { ProductWithDetails } from "@/data/data-access/products.queries";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem extends ProductWithDetails {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: ProductWithDetails, quantity: number) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  getTotalItems: () => number;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: ProductWithDetails, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          // Update quantity if item exists
          set({
            items: currentItems.map((item) =>
              item.id === data.id ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          });
          // toast.success("Cart updated successfully");
          return;
        }

        set({ items: [...currentItems, { ...data, quantity }] });
        // toast.success("Item added to cart");
      },
      removeItem: (id: string) => {
        const currentItems = get().items;
        set({ items: currentItems.filter((item) => item.id !== id) });
        // toast.success("Item removed from cart");
      },
      removeAll: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        if (quantity <= 0) {
          set({ items: currentItems.filter((item) => item.id !== id) });
          // toast.success("Item removed from cart");
          return;
        }
        set({
          items: currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
        });
        // toast.success("Cart updated successfully");
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
