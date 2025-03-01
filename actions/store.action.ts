"use server"

import { auth } from "@/auth";
import { ActionResult } from "@/types/api";
import { createStoreQuery } from "@/lib/data-access/store-quries";
import { createActionResponse } from "@/lib/helper";
import { StoreSchema, StoreSchemaType } from "@/lib/validator/store-validator";
import { stores } from "@/drizzle/schema";


export async function createStoreAction(formData: StoreSchemaType): Promise<ActionResult<typeof stores.$inferSelect>> {

    const session = await auth()

    if (!session || !session?.user) {
        return createActionResponse(false, undefined, "Unauthorized")
    }

    const { id: userId } = session.user

    const validationResult = StoreSchema.safeParse({ name: formData.name, userId });

    if (!validationResult.success) {
        return createActionResponse(false, undefined, "Invalid input")
    }

    const store = await createStoreQuery(validationResult.data.name, userId as string)

    if (store.success) {
        return createActionResponse(true, store.data, "Store created successfully")
    }

    return createActionResponse(false, undefined, "Store creation failed")

}
