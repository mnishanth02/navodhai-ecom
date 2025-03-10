"use server";

import { z } from "zod";
import { authActionClient } from "@/lib/utils/safe-action";
import { BillboardSchema } from "@/lib/validator/store-validator";
import { ActionError } from "@/lib/error";
import { createBillboardQuery, deleteBillboardQuery, getBillboardByIdQuery, updateBillboardQuery } from "../data-access/billboard.queries";

// Create billboard action
export const createBillboard = authActionClient
    .metadata({
        actionName: "createBillboard",
        requiresAuth: true
    })
    .schema(BillboardSchema.extend({ storeId: z.string().min(1) }))
    .action(async ({ parsedInput, ctx }) => {
        const { label, imageUrl, storeId } = parsedInput;
        const { userId } = ctx;

        if (!userId) {
            throw new ActionError("User ID is required");
        }

        const result = await createBillboardQuery(label, imageUrl, storeId);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to create billboard");
        }

        return {
            billboard: result.data,
            message: "Billboard created successfully"
        };
    });

// Update billboard action
export const updateBillboard = authActionClient
    .metadata({
        actionName: "updateBillboard",
        requiresAuth: true
    })
    .schema(z.object({
        billboardId: z.string().min(1, "Billboard ID is required"),
        label: z.string().min(1, "Billboard label is required").max(255, "Billboard label cannot exceed 255 characters"),
        imageUrl: z.string().min(1, "Billboard image URL is required")
    }))
    .action(async ({ parsedInput, ctx }) => {
        const { billboardId, label, imageUrl } = parsedInput;
        // Verify store ownership (optional additional security check)
        const billboardCheck = await getBillboardByIdQuery(billboardId);
        if (!billboardCheck.success) {
            throw new ActionError("You don't have permission to update this billboard");
        }

        const result = await updateBillboardQuery(billboardId, label, imageUrl);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to update billboard");
        }

        return {
            billboard: result.data,
            message: "Billboard updated successfully"
        };
    });

// Delete billboard action
export const deleteBillboard = authActionClient
    .metadata({
        actionName: "deleteBillboard",
        requiresAuth: true
    })
    .schema(z.object({
        billboardId: z.string().min(1, "Billboard ID is required")
    }))
    .action(async ({ parsedInput, ctx }) => {
        const { billboardId } = parsedInput;
        const { userId } = ctx;

        // Verify store ownership (optional additional security check)
        const billboardCheck = await getBillboardByIdQuery(billboardId);
        if (!billboardCheck.success) {
            throw new ActionError("You don't have permission to delete this billboard");
        }

        const result = await deleteBillboardQuery(billboardId);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to delete billboard");
        }

        return {
            billboard: result.data,
            message: "Billboard deleted successfully"
        };
    });