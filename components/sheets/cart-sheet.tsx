"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/store/use-cart";
import { useSheetStore } from "@/hooks/store/use-sheet";
import { currencyFormatter } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export function CartSheet() {
  const cart = useCart();
  const router = useRouter();
  const sheetStore = useSheetStore();

  const totalPrice = cart.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const onCheckout = () => {
    router.push("/cart");
    sheetStore.onClose();
  };

  const onBrowseProducts = () => {
    router.push("/products");
    sheetStore.onClose();
  };

  return (
    <Sheet open={sheetStore.isOpen} onOpenChange={sheetStore.onClose}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Cart
              {cart.getTotalItems() > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {cart.getTotalItems()}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>
        {cart.items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="relative mb-4 h-60 w-60">
              <Image src="/empty-cart.png" fill alt="empty cart" className="object-contain" />
            </div>
            <div className="font-semibold text-xl">Your cart is empty</div>
            <Button
              onClick={onBrowseProducts}
              variant="link"
              className="text-muted-foreground text-sm"
            >
              Add items to your cart to checkout
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="flex flex-col gap-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="group space-y-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 items-start space-x-4">
                        <div className="relative aspect-square h-24 w-24 min-w-fit overflow-hidden rounded-md">
                          <Image
                            src={item.primaryImageUrl || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="absolute object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col space-y-1 self-start">
                          <span className="line-clamp-1 font-medium text-base">{item.name}</span>
                          <div className="flex flex-col space-y-0.5 text-muted-foreground text-sm">
                            {"size" in item && item.size && (
                              <span>Size: {String(item.size.name)}</span>
                            )}
                            {"color" in item && item.color && (
                              <div className="flex items-center gap-1.5">
                                <span>Color: {String(item.color.name)}</span>
                                <div
                                  className="h-4 w-4 rounded-full border"
                                  style={{
                                    backgroundColor:
                                      typeof item.color === "string" ? item.color : undefined,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-medium text-base text-primary">
                          {currencyFormatter.format(Number(item.price))}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => cart.removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-4 space-y-4 border-t pt-4 pr-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{currencyFormatter.format(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-semibold text-lg">
                    {currencyFormatter.format(totalPrice)}
                  </span>
                </div>
              </div>
              <Button
                onClick={onCheckout}
                size="lg"
                className="w-full bg-primary font-semibold hover:bg-primary/90"
              >
                Proceed to Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
