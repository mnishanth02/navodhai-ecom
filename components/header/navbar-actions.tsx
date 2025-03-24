"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/store/use-cart";
import { useSheetStore } from "@/hooks/store/use-sheet";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const NavBarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const sheetStore = useSheetStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Button
        size={"sm"}
        variant="outline"
        className="rounded-full border-2"
        onClick={sheetStore.onOpen}
      >
        <ShoppingBag size={20} />
        <span className="ml-2">{cart.getTotalItems()}</span>
      </Button>
    </div>
  );
};

export default NavBarActions;
