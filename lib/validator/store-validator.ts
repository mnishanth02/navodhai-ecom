import { z } from "zod";

export const StoreSchema = z.object({
  name: z.string().min(1),
});

export const BillboardSchema = z.object({
  label: z.string().min(1),
  imageUrls: z.array(z.string()).min(1, "At least one image is required"),
  primaryImageUrl: z.string().min(1, "Primary image is required"),
});

export const CategorySchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});
export const SizeSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});
export const ColorSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be a valid HEX code",
  }),
});

export const ProductSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  primaryImageUrl: z.string().min(1, "Primary image is required"),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export type StoreSchemaType = z.infer<typeof StoreSchema>;
export type BillboardSchemaType = z.infer<typeof BillboardSchema>;
export type CategorySchemaType = z.infer<typeof CategorySchema>;
export type SizeSchemaType = z.infer<typeof SizeSchema>;
export type ColorSchemaType = z.infer<typeof ColorSchema>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
