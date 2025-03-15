"use client";

import Loader from "@/components/common/loader";
import type { StoreType } from "@/drizzle/schema/store";
import { useStoreModal } from "@/hooks/store/use-store-modal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface StoreProps {
  store: StoreType | null | undefined;
}

const StoreCheck = ({ store }: StoreProps) => {
  const { isOpen, onOpen } = useStoreModal();
  const router = useRouter();

  useEffect(() => {
    if (store?.id) {
      router.push(`/admin/${store.id}`);
    } else {
      if (!isOpen) {
        onOpen();
      }
    }
  }, [isOpen, onOpen, store?.id, router]);

  return <Loader />;
};

export default StoreCheck;
