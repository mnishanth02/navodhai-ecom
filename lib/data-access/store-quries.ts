



import { z } from "zod";
import { ApiResponse, validateAndExecute } from "../helper";
import db from "@/drizzle/db";
import { stores } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";



// ******************************************************
// *******************  createStoreQuery ****************
// ******************************************************
export async function createStoreQuery(name: string, userId: string): Promise<ApiResponse<{ success: boolean, message: string }>> {
    return validateAndExecute(z.object({ name: z.string(), userId: z.string() }), { name, userId }, async (parsedInput) => {
        const { name, userId } = parsedInput
        const store = await db.insert(stores).values({ name, userId })
        if (store) {
            return {
                success: true,
                message: "Store created successfully",
            }
        }

        return {
            success: false,
            message: "Store creation failed",
        }
    });
}

// ******************************************************
// *******************  getStoreByIdQuery ****************
// ******************************************************
export async function getStoreByIdQuery(storeId: string, userId: string): Promise<ApiResponse<{ success: boolean, data: typeof stores.$inferSelect | null }>> {
    return validateAndExecute(z.object({ storeId: z.string(), userId: z.string() }), { storeId, userId }, async (parsedInput) => {
        const { storeId, userId } = parsedInput

        const store = await db.query.stores.findFirst({
            where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
        });
        if (store) {
            return {
                success: true,
                data: store,
            }
        }
        return {
            success: false,
            data: null,
        }
    });
}


// ******************************************************
// *******************  getStoreByIdUserIdQuery ****************
// ******************************************************
export async function getStoreByIdUserIdQuery(userId: string): Promise<ApiResponse<{ success: boolean, data: typeof stores.$inferSelect | null }>> {
    return validateAndExecute(z.object({ userId: z.string() }), { userId }, async (parsedInput) => {
        const { userId } = parsedInput

        const store = await db.query.stores.findFirst({
            where: eq(stores.userId, userId),
        });

        if (store) {
            return {
                success: true,
                data: store,
            }
        }
        return {
            success: false,
            data: null,
        }


    });
}