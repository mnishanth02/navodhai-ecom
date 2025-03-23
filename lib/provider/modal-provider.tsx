"use client";

import StoreModal from "@/components/modals/store-modal";
import { PreviewModal } from "@/components/root/preview-modal";
import { CartSheet } from "@/components/sheets/cart-sheet";
import { useMounted } from "@/hooks/general/use-mounted";

export const ModalProvider = () => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <>
      <StoreModal />
      <PreviewModal />
      <CartSheet />
    </>
  );
};
