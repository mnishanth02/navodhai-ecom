import { cn } from "@/lib/utils";
import Image from "next/image";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

interface GalleryImageProps {
  image: { url: string; id: string };
  isSelected: boolean;
  isLoading?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  className?: string;
}

const GalleryImage = ({
  image,
  isLoading,
  onLoad,
  onError,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  className,
}: GalleryImageProps) => {
  return (
    <Image
      fill
      src={image.url}
      alt="Product image"
      className={cn(
        "object-cover object-center transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100",
        className,
      )}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      sizes={sizes}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default GalleryImage;
