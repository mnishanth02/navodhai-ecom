"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import usePreviewModal from "@/hooks/store/use-preview-modal";
import { X } from "lucide-react";
import Gallery from "./gallery";
import Info from "./info";

export const PreviewModal = () => {
  const previewModal = usePreviewModal();
  const product = usePreviewModal((state) => state.data);

  if (!product) {
    return null;
  }

  // Create images array for gallery, ensuring correct type structure
  const images = [
    { url: product.primaryImageUrl || "", id: "primary" },
    ...(product.images || []).map((image) => ({
      url: typeof image === "string" ? image : image.url,
      id: typeof image === "string" ? image : image.id,
    })),
  ];

  return (
    <Dialog open={previewModal.isOpen} onOpenChange={previewModal.onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{product.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={previewModal.onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 p-6 sm:grid-cols-12 lg:gap-x-8">
          <div className="sm:col-span-4 lg:col-span-5">
            <Gallery images={images} />
          </div>
          <div className="sm:col-span-8 lg:col-span-7">
            <Info data={product} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
