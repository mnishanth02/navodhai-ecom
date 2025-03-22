"use client";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const NaveBarActions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  // const cart = useCart();

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Button
        size={"sm"}
        variant="outline"
        className="rounded-full border-2 "
        onClick={() => router.push("/cart")}
      >
        <ShoppingBag size={20} />
        {/* <span className="">{cart.items.length}</span> */}
        <span className="">{"2"}</span>
      </Button>
    </div>
  );
};

export default NaveBarActions;
