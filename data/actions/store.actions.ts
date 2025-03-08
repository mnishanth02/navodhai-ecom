"use server";

import { z } from "zod";
import { authActionClient } from "@/lib/safe-action";
import {
    createStoreQuery,
    updateStoreQuery,
    deleteStoreQuery,
    getStoreByIdQuery,
    getStoreByUserIdQuery,
    getAllStoreByUserIdQuery
} from "@/data/data-access/store-quries";
import { StoreSchema } from "@/lib/validator/store-validator";
import { ActionError } from "@/lib/error";

// Create store action
export const createStore = authActionClient
    .metadata({
        actionName: "createStore",
        requiresAuth: true
    })
    .schema(StoreSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { name } = parsedInput;
        const { userId } = ctx;

        if (!userId) {
            throw new ActionError("User ID is required");
        }

        const result = await createStoreQuery(name, userId);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to create store");
        }

        return {
            store: result.data,
            message: "Store created successfully"
        };
    });

// Update store action
export const updateStore = authActionClient
    .metadata({
        actionName: "updateStore",
        requiresAuth: true
    })
    .schema(z.object({
        storeId: z.string().min(1, "Store ID is required"),
        name: z.string().min(1, "Store name is required").max(255, "Store name cannot exceed 255 characters")
    }))
    .action(async ({ parsedInput, ctx }) => {
        const { storeId, name } = parsedInput;
        const { userId } = ctx;

        // Verify store ownership (optional additional security check)
        const storeCheck = await getStoreByIdQuery(storeId, userId);
        if (!storeCheck.success) {
            throw new ActionError("You don't have permission to update this store");
        }

        const result = await updateStoreQuery(storeId, name);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to update store");
        }

        return {
            store: result.data,
            message: "Store updated successfully"
        };
    });

// Delete store action
export const deleteStore = authActionClient
    .metadata({
        actionName: "deleteStore",
        requiresAuth: true
    })
    .schema(z.object({
        storeId: z.string().min(1, "Store ID is required")
    }))
    .action(async ({ parsedInput, ctx }) => {
        const { storeId } = parsedInput;
        const { userId } = ctx;

        // Verify store ownership (optional additional security check)
        const storeCheck = await getStoreByIdQuery(storeId, userId);
        if (!storeCheck.success) {
            throw new ActionError("You don't have permission to delete this store");
        }

        const result = await deleteStoreQuery(storeId);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to delete store");
        }

        return {
            store: result.data,
            message: "Store deleted successfully"
        };
    });

// Get store by ID action
export const getStoreById = authActionClient
    .metadata({
        actionName: "getStoreById",
        requiresAuth: true
    })
    .schema(z.object({
        storeId: z.string().min(1, "Store ID is required")
    }))
    .action(async ({ parsedInput, ctx }) => {
        const { storeId } = parsedInput;
        const { userId } = ctx;

        const result = await getStoreByIdQuery(storeId, userId);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to get store");
        }

        return {
            store: result.data
        };
    });

// Get store by user ID action
export const getStoreByUserId = authActionClient
    .metadata({
        actionName: "getStoreByUserId",
        requiresAuth: true
    })
    .action(async ({ ctx }) => {
        const { userId } = ctx;

        const result = await getStoreByUserIdQuery(userId);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to get store");
        }

        return {
            store: result.data
        };
    });

// Get all stores by user ID action
export const getAllStoresByUserId = authActionClient
    .metadata({
        actionName: "getAllStoresByUserId",
        requiresAuth: true
    })
    .action(async ({ ctx }) => {
        const { userId } = ctx;

        const result = await getAllStoreByUserIdQuery(userId);

        if (!result.success) {
            throw new ActionError(result.error?.message || "Failed to get stores");
        }

        return {
            stores: result.data
        };
    });