import "server-only";

import { auth } from "@/auth";
import {
  getAllStoreByUserIdQuery,
  getStoreByIdQuery,
  getStoreByUserIdQuery,
} from "@/data/data-access/store.queries";
import type { User } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

/**
 * Check authentication and return user with guaranteed ID
 * This function is not cached as it should always check the current session
 */
export const checkAuth = async (): Promise<User> => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  return {
    ...session.user,
    id: session.user.id,
  };
};

/**
 * Get the current user's ID - cached for reuse across functions
 */
export const getCurrentUserId = cache(async (): Promise<string> => {
  const user = await checkAuth();
  if (!user.id) {
    redirect("/auth/sign-in");
  }
  return user.id;
});

/**
 * Validate and get the user's primary store
 * Cached for reuse across the application
 */
export const validateUserStore = cache(async () => {
  const userId = await getCurrentUserId();
  const response = await getStoreByUserIdQuery(userId);

  return {
    store: response.success ? response.data : null,
    userId,
  };
});

/**
 * Validate and get a specific store by ID
 * Cached per storeId for efficient reuse
 */
export const validateSpecificStore = cache(async (storeId: string) => {
  const userId = await getCurrentUserId();
  const store = await getStoreByIdQuery(storeId, userId);

  if (!store.success) {
    console.log("[validateSpecificStore] redirecting to admin");
    redirect("/admin");
  }

  return store.data;
});

/**
 * Get the user and store for a specific store ID
 * Cached per storeId for efficient reuse
 */
export const getStoreAndUser = cache(async (storeId: string) => {
  const user = await checkAuth();
  const store = await validateSpecificStore(storeId);
  return { user, store };
});

/**
 * Get all stores for the current user
 * Cached for reuse across the application
 */
export const getAllStoresByUserId = cache(async () => {
  const userId = await getCurrentUserId();
  const response = await getAllStoreByUserIdQuery(userId);

  // Return empty array if no stores found
  if (!response.success) {
    return [];
  }

  return response.data || [];
});

/**
 * Check if user has any stores
 * Useful for conditional UI rendering
 */
export const hasStores = cache(async (): Promise<boolean> => {
  const stores = await getAllStoresByUserId();
  return stores.length > 0;
});

/**
 * Get store by ID without redirection
 * Useful when you want to handle the not-found case yourself
 */
export const getStoreById = cache(async (storeId: string) => {
  const userId = await getCurrentUserId();
  const response = await getStoreByIdQuery(storeId, userId);
  return response.success ? response.data : null;
});
