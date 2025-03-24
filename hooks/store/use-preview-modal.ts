import type { ProductWithDetails } from "@/data/data-access/products.queries";
import { create } from "zustand";

interface PreviewModalStore {
  isOpen: boolean;
  data?: ProductWithDetails;
  onOpen: (data: ProductWithDetails) => void;
  onClose: () => void;
}

const usePreviewModal = create<PreviewModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: ProductWithDetails) => set({ data, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;
