import GalleryControls from "./gallery-controls";

interface GalleryProps {
  images: { url: string; id: string }[];
}

const Gallery = ({ images = [] }: GalleryProps) => {
  return <GalleryControls images={images} />;
};

export default Gallery;
