"use client";

import type { ProductWithDetails } from "@/data/data-access/products.queries";
import { useCopyToClipboard } from "@/hooks/general/use-copy-to-clipboard";
import { useCart } from "@/hooks/store/use-cart";
import { currencyFormatter } from "@/lib/utils";
import { Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface InfoProps {
  data: ProductWithDetails;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const { copyToClipboard } = useCopyToClipboard();

  const onAddToCart = () => {
    cart.addItem(data, quantity);
  };

  const onShare = async () => {
    copyToClipboard(window.location.href);
    toast.success("Product link copied to clipboard!");

    try {
      const shareData = {
        title: data.name,
        text: `Check out ${data.name} on our store!`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        // Fallback to clipboard copy if Web Share API is not supported
        copyToClipboard(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          // User canceled the share operation - no need to show error
          return;
        }
        // Handle other errors
        toast.error("Failed to share. Please try copying the link instead.");
      }
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="space-y-8 rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-4">
        <h1 className="font-bold text-3xl tracking-tight">{data.name}</h1>
        <div className="flex items-end justify-between">
          <p className="font-semibold text-2xl text-primary">
            <span>{currencyFormatter.format(Number(data?.price))}</span>
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            className="rounded-full transition-colors hover:bg-primary/10"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-6">
        {data.description && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{data.description}</p>
          </div>
        )}

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-lg">Size</h3>
          <Badge variant="secondary" className="text-sm">
            {data?.size?.name} ({data?.size?.value})
          </Badge>
        </div>

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-lg">Color</h3>
          <div className="flex items-center gap-x-2">
            <div
              className="h-6 w-6 rounded-full border shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: data?.color?.value }}
            />
            <span className="text-muted-foreground">{data?.color?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-lg">Quantity</h3>
          <div className="flex items-center gap-x-3 rounded-full bg-secondary/50 p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-secondary"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium text-lg">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-secondary"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3 pt-4">
        <Button
          onClick={onAddToCart}
          size="lg"
          className="flex w-full items-center gap-x-2 transition-transform hover:scale-105 sm:w-auto"
        >
          Add to Cart
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Info;
