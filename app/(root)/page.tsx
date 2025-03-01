"use client";

import { useStoreModal } from "@/store/use-store-modal";
import { useEffect } from "react";

const MainPage = () => {
  const { isOpen, onOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div></div>
    </div>
  );
};

export default MainPage;
