"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import GalleryImage from "./gallery-image";

interface GalleryControlsProps {
  images: { url: string; id: string }[];
}

const GalleryControls = ({ images = [] }: GalleryControlsProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleKeyNavigation = useCallback(
    (e: KeyboardEvent) => {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setSelectedImage(images[currentIndex - 1]);
        setIsLoading(true);
        setError(null);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setSelectedImage(images[currentIndex + 1]);
        setIsLoading(true);
        setError(null);
      }
    },
    [images, selectedImage.id],
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
      if (currentIndex < images.length - 1) {
        setSelectedImage(images[currentIndex + 1]);
        setIsLoading(true);
        setError(null);
      }
    },
    onSwipedRight: () => {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
      if (currentIndex > 0) {
        setSelectedImage(images[currentIndex - 1]);
        setIsLoading(true);
        setError(null);
      }
    },
    touchEventOptions: { passive: false },
    trackMouse: true,
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  if (!images.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg">
        <p className=" text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" role="region" aria-label="Product gallery">
      {/* Main Image Display */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg" {...handlers}>
        {error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        ) : (
          <GalleryImage
            image={selectedImage}
            isSelected={true}
            isLoading={isLoading}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError("Error loading image");
              setIsLoading(false);
            }}
            priority
          />
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      <div className="mx-auto w-full max-w-2xl lg:max-w-none">
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {images.map((image) => (
              <CarouselItem key={image.id} className="basis-1/4 cursor-pointer pl-4">
                <button
                  onClick={() => {
                    setSelectedImage(image);
                    setIsLoading(true);
                    setError(null);
                  }}
                  className={cn(
                    "relative aspect-square w-full overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    selectedImage.id === image.id
                      ? "scale-[0.95] transform shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background transition-all duration-200"
                      : "transition-all duration-200 hover:scale-[0.98] hover:opacity-75",
                  )}
                  aria-label={`View ${image.url.split("/").pop() || "image"}`}
                  aria-pressed={selectedImage.id === image.id}
                >
                  <GalleryImage
                    image={image}
                    isSelected={selectedImage.id === image.id}
                    sizes="(max-width: 768px) 25vw, 20vw"
                    quality={60}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 4 && (
            <>
              <CarouselPrevious className="-left-3 size-8 rounded-full" />
              <CarouselNext className="-right-3 size-8 rounded-full" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default GalleryControls;
