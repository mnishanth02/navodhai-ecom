"use server"

import { auth } from "@/auth";
import { ActionResponse } from "@/types/api";
import { createStoreQuery } from "@/lib/data-access/store-quries";
import { StoreSchema, StoreSchemaType } from "@/lib/validator/store-validator";
import { stores } from "@/drizzle/schema";
import { handleValidationError } from "@/lib/utils/action-handler";


export async function createStoreAction(formData: StoreSchemaType): Promise<ActionResponse<typeof stores.$inferSelect | null>> {

    const session = await auth()

    if (!session || !session?.user) {
        return {
            success: false,
            error: {
                serverError: {
                    message: "Unauthorized",
                    code: 401
                }
            }
        }
    }

    const { id: userId } = session.user

    const validationResult = StoreSchema.safeParse({ name: formData.name, userId });

    if (!validationResult.success) {
        return handleValidationError(validationResult.error.flatten().fieldErrors);
    }

    const store = await createStoreQuery(validationResult.data.name, userId as string)

    if (store.success) {
        return {
            success: true,
            data: store.data,
            message: "Store created successfully"
        }
    }

    return {
        success: false,
        error: {
            serverError: {
                message: "Store creation failed",
                code: 500
            }
        }
    }
}
