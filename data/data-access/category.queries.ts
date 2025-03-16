import "server-only";
import db from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import type { BillboardType, CategoryType } from "@/drizzle/schema/store";
import type { ApiResponse } from "@/types/api";
import { eq } from "drizzle-orm";

// ******************************************************
// *******************  getCategorydById ****************
// ******************************************************

type CategoryWithBillboard = CategoryType & {
  billboard: BillboardType;
};

export async function getCategoryByIdQuery(
  categoryId: string,
): Promise<ApiResponse<CategoryWithBillboard>> {
  try {
    const categoryData = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
      with: {
        billboard: true,
      },
    });

    if (categoryData) {
      return {
        success: true,
        data: categoryData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Category not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ************* getAllCategoryByStoreIdQuery ***********
// ******************************************************

export async function getAllCategoryByStoreIdQuery(
  storeId: string,
): Promise<ApiResponse<CategoryWithBillboard[]>> {
  try {
    const category = await db.query.categories.findMany({
      where: eq(categories.storeId, storeId),
      with: {
        billboard: true,
      },
    });

    if (category) {
      return {
        success: true,
        data: category,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Category not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  createCategoryQuery  ****************
// ******************************************************

export async function createCategoryQuery(
  name: string,
  billboardId: string,
  storeId: string,
): Promise<ApiResponse<CategoryType>> {
  try {
    const category = await db
      .insert(categories)
      .values({
        name,
        billboardId,
        storeId,
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (category) {
      return {
        success: true,
        data: category,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Category not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// ***************** updatecategoryQuery  **************
// ******************************************************

export async function updateCategoryQuery(
  id: string,
  data: Partial<CategoryType>,
): Promise<ApiResponse<CategoryType>> {
  try {
    const category = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (category) {
      return {
        success: true,
        data: category,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Category not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

// ******************************************************
// *******************  deleteCategoryQuery  ***********
// ******************************************************

export async function deleteCategoryQuery(id: string): Promise<ApiResponse<CategoryType>> {
  try {
    const category = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()
      .then((res) => res[0] ?? null);

    if (category) {
      return {
        success: true,
        data: category,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Category not found",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
