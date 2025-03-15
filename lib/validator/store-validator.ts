import { z } from "zod";

export const StoreSchema = z.object({
  name: z.string().min(1),
});

export const BillboardSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export type StoreSchemaType = z.infer<typeof StoreSchema>;
export type BillboardSchemaType = z.infer<typeof BillboardSchema>;
