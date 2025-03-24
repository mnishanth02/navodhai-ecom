"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/store/use-cart";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function CheckoutClient() {
  const cart = useCart();

  const onQuantityChange = (id: string, quantity: number) => {
    cart.updateQuantity(id, quantity);
  };

  const onRemove = (id: string) => {
    cart.removeItem(id);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-medium text-lg">Your Product List</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 rounded-lg border p-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-md">
              <Image
                fill
                src={item.primaryImageUrl || "/placeholder.png"}
                alt={item.name}
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="mt-1 text-sm">Category: {item.category?.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span>Color: {item.color?.name}</span>
                    <span>Size: {item.size?.name}</span>
                  </div>
                </div>
                <p className="font-medium text-sm">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="min-w-[2rem] text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button variant="destructive" size="icon" onClick={() => onRemove(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {cart.items.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-dashed py-8">
            <p className=" text-sm">Your cart is empty</p>
            <Link href="/products" className={buttonVariants({ variant: "outline" })}>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {cart.items.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Shipping Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input placeholder="Phone Number" className="col-span-2" />
            <Input placeholder="Address" className="col-span-2" />
            <Input placeholder="City" />
            <Input placeholder="Postal Code" />
          </div>
        </div>
      )}
    </div>
  );
}
