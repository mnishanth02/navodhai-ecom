

import db from "@/drizzle/db";
import { billboard } from "@/drizzle/schema";
import { BillboardType } from "@/drizzle/schema/store";
import { ApiResponse } from "@/types/api";
import { eq } from "drizzle-orm";
import { z } from "zod";


// ******************************************************
// *******************  getBillboardById ****************
// ******************************************************

export async function getBillboardByIdQuery(billId: string): Promise<ApiResponse<BillboardType>> {

    const schema = z.object({ billId: z.string().min(1) });
    const validatedData = schema.parse({ billId });

    try {
        const billboardData = await db.query.billboard.findFirst({
            where: eq(billboard.id, validatedData.billId),
        });
        console.log(billboardData);

        if (billboardData) {
            return {
                success: true,
                data: billboardData,
            };
        }

        return {
            success: false,
            error: {
                code: 404,
                message: "Billboard not found",
            }
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: {
                    code: 400,
                    message: `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
                }
            };
        }

        return {
            success: false,
            error: {
                code: 500,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            }
        };
    }
}


// ******************************************************
// *******************  createBillboardQuery  ****************
// ******************************************************

export async function createBillboardQuery(label: string, imageUrl: string, storeId: string): Promise<ApiResponse<BillboardType>> {

    const schema = z.object({ label: z.string().min(1), imageUrl: z.string().min(1), storeId: z.string().min(1) });
    const validatedData = schema.parse({ label, imageUrl, storeId });
    try {
        const billboardData = await db.insert(billboard)
            .values({ label: validatedData.label, imageUrl: validatedData.imageUrl, storeId: validatedData.storeId })
            .returning()
            .then((res) => res[0] ?? null);

        if (billboardData) {
            return {
                success: true,
                data: billboardData,
                message: "Billboard created successfully",
            };
        }

        return {
            success: false,
            error: {
                code: 404,
                message: "Billboard creation failed",
            }
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: {
                    code: 400,
                    message: `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
                }
            };
        }

        return {
            success: false,
            error: {
                code: 500,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            }
        };
    }
}


// ******************************************************
// ***************** updateBillboardQuery  **************
// ******************************************************

export async function updateBillboardQuery(billboardId: string, label: string, imageUrl: string): Promise<ApiResponse<BillboardType>> {

    const schema = z.object({ billboardId: z.string().min(1), label: z.string().min(1), imageUrl: z.string().min(1) });
    const validatedData = schema.parse({ billboardId, label, imageUrl });

    try {
        const billboardData = await db.update(billboard)
            .set({ label: validatedData.label, imageUrl: validatedData.imageUrl })
            .where(eq(billboard.id, validatedData.billboardId))
            .returning()
            .then((res) => res[0] ?? null);

        if (billboardData) {
            return {
                success: true,
                data: billboardData,
                message: "Billboard updated successfully",
            };
        }

        return {
            success: false,
            error: {
                code: 404,
                message: "Billboard update failed",
            }
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: {
                    code: 400,
                    message: `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
                }
            };
        }

        return {
            success: false,
            error: {
                code: 500,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            }
        };
    }
}


// ******************************************************
// *******************  deleteBillboardQuery  ***********
// ******************************************************

export async function deleteBillboardQuery(billboardId: string): Promise<ApiResponse<BillboardType>> {

    const schema = z.object({ billboardId: z.string().min(1) });
    const validatedData = schema.parse({ billboardId });

    try {
        const billboardData = await db.delete(billboard)
            .where(eq(billboard.id, validatedData.billboardId))
            .returning()
            .then((res) => res[0] ?? null);

        if (billboardData) {
            return {
                success: true,
                data: billboardData,
                message: "Billboard deleted successfully",
            };
        }

        return {
            success: false,
            error: {
                code: 404,
                message: "Billboard deletion failed",
            }
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: {
                    code: 400,
                    message: `Validation error: ${error.errors.map(e => e.message).join(', ')}`,
                }
            };
        }

        return {
            success: false,
            error: {
                code: 500,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            }
        };
    }
}
