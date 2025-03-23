"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/store/use-cart";
import { DELIVERY_FEE, TAX_RATE } from "@/lib/config/constants";
import { currencyFormatter } from "@/lib/utils";

export default function CartSummary() {
  const cart = useCart();

  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const taxes = subtotal * TAX_RATE;
  const delivery = cart.items.length === 0 ? 0 : subtotal > 500 ? 0 : DELIVERY_FEE;
  const total = subtotal + taxes + delivery;

  return (
    <div className="rounded-lg px-4 py-6">
      <h2 className="font-medium text-lg">Detail Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm">Subtotal Product</p>
          <p className="font-medium text-sm">{currencyFormatter.format(subtotal)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Price Delivery</p>
          <p className="font-medium text-sm">
            {delivery === 0 ? "Free" : currencyFormatter.format(delivery)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Taxes</p>
          <p className="font-medium text-sm">{currencyFormatter.format(taxes)}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-medium">
          <p>Total</p>
          <p>{currencyFormatter.format(total)}</p>
        </div>
      </div>

      <div className="mt-6">
        <Input placeholder="Enter your promo code" className="mb-4" />
        <div className="space-y-4">
          <Button className="w-full">Checkout Now</Button>
        </div>
      </div>
    </div>
  );
}
