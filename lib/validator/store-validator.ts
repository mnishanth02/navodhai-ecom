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

export type StoreSchemaType = z.infer<typeof StoreSchema>;
export type BillboardSchemaType = z.infer<typeof BillboardSchema>;
export type CategorySchemaType = z.infer<typeof CategorySchema>;
export type SizeSchemaType = z.infer<typeof SizeSchema>;
