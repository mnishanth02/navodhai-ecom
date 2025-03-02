"use server"

import { auth } from "@/auth";
import { ActionResponse } from "@/types/api";
import { createStoreQuery, updateStoreQuery, deleteStoreQuery } from "@/lib/data-access/store-quries";
import { StoreSchema } from "@/lib/validator/store-validator";
import { stores } from "@/drizzle/schema";
import { handleValidationError } from "@/lib/utils/action-handler";
import { storesUpdateSchema } from "@/drizzle/schema/store";


export async function createStoreAction(name: string): Promise<ActionResponse<typeof stores.$inferSelect | null>> {

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

    const validationResult = StoreSchema.safeParse({ name });
    console.log(validationResult);


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


// ******************************************************
// *******************  updateStoreAction ****************
// ******************************************************
export async function updateStoreAction(formData: { name: string, storeId: string }): Promise<ActionResponse<typeof stores.$inferSelect | null>> {

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

    // Create an update object with the required fields
    const updateData = {
        id: formData.storeId,
        name: formData.name,
        userId: userId
    };

    // Validate the update data using storesUpdateSchema
    const { success, error } = storesUpdateSchema.safeParse(updateData);

    if (!success) {
        return handleValidationError(error.flatten().fieldErrors);
    }

    // Pass the storeId and name to the updateStoreQuery
    const store = await updateStoreQuery(formData.storeId, formData.name);

    if (store.success) {
        return {
            success: true,
            data: store.data,
            message: "Store updated successfully"
        }
    }

    return {
        success: false,
        error: {
            serverError: {
                message: store.error?.message || "Store update failed",
                code: store.error?.code || 500
            }
        }
    }
}

// ******************************************************
// *******************  deleteStoreAction ****************
// ******************************************************
export async function deleteStoreAction(storeId: string): Promise<ActionResponse<typeof stores.$inferSelect | null>> {

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

    // Validate that the store belongs to the user and exists
    // We can use a more specific validation for deletion
    const validationData = {
        id: storeId,
        userId: userId
    };

    // Use storesUpdateSchema for validation since we're checking if the store exists and belongs to the user
    const { success, error } = storesUpdateSchema.pick({ id: true, userId: true }).safeParse(validationData);

    if (!success) {
        return handleValidationError(error.flatten().fieldErrors);
    }

    const store = await deleteStoreQuery(storeId)

    if (store.success) {
        return {
            success: true,
            data: store.data,
            message: "Store deleted successfully"
        }
    }

    return {
        success: false,
        error: {
            serverError: {
                message: store.error?.message || "Store deletion failed",
                code: store.error?.code || 500
            }
        }
    }
}