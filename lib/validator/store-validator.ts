import { z } from "zod";


export const StoreSchema = z.object({
    name: z.string().min(1),
});


export type StoreSchemaType = z.infer<typeof StoreSchema>;
