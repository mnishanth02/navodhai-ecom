import { create } from "zustand";

interface SheetStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSheetStore = create<SheetStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
