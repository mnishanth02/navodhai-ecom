"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ProductWithDetails } from "@/data/data-access/products.queries";
import { currencyFormatter } from "@/lib/utils";
import { Expand, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MouseEventHandler } from "react";

interface ProductCardProps {
  data: ProductWithDetails;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    // previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    // cart.addItem(data);
  };

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer gap-2 py-4 transition-all hover:shadow-lg"
    >
      <CardContent className="p-2">
        <div className="relative aspect-square">
          <Image
            src={data?.primaryImageUrl || ""}
            fill
            alt={data.name}
            className="rounded-md object-cover"
          />
          <div className="absolute bottom-5 w-full px-6 opacity-0 transition group-hover:opacity-100">
            <div className="flex justify-center gap-x-3">
              <Button onClick={onPreview} variant="secondary" size="icon" className="rounded-full">
                <Expand className="h-4 w-4" />
              </Button>
              <Button
                onClick={onAddToCart}
                variant="secondary"
                size="icon"
                className="rounded-full"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 px-3 py-0">
        <div className="flex w-full items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{data.name}</h3>
            <Badge variant="secondary">{data.category?.name}</Badge>
          </div>
          <div className="font-semibold text-lg">
            {currencyFormatter.format(Number(data.price))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
