import "server-only";
import db from "@/drizzle/db";
import { billboard } from "@/drizzle/schema";
import type { BillboardType } from "@/drizzle/schema/store";
import type { ApiResponse } from "@/types/api";
import { desc, eq } from "drizzle-orm";

// ******************************************************
// *******************  getBillboardById ****************
// ******************************************************

export async function getBillboardByIdQuery(billId: string): Promise<ApiResponse<BillboardType>> {
  try {
    const billboardData = await db.query.billboard.findFirst({
      where: eq(billboard.id, billId),
    });

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
// ************* getAllBillBoardByStoreIdQuery ***********
// ******************************************************

export async function getAllBillBoardByStoreIdQuery(
  storeId: string,
): Promise<ApiResponse<BillboardType[]>> {
  try {
    const billboards = await db.query.billboard.findMany({
      where: eq(billboard.storeId, storeId),
      orderBy: [desc(billboard.createdAt)],
    });

    if (billboards) {
      return {
        success: true,
        data: billboards,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No billboards found for this store",
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
// *******************  createBillboardQuery  ****************
// ******************************************************

export async function createBillboardQuery(
  label: string,
  primaryImageUrl: string,
  storeId: string,
  imageUrls: string[],
): Promise<ApiResponse<BillboardType>> {
  try {
    const billboardData = await db
      .insert(billboard)
      .values({
        label: label,
        primaryImageUrl: primaryImageUrl,
        storeId: storeId,
        imageUrls: imageUrls,
      })
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
// ***************** updateBillboardQuery  **************
// ******************************************************

export async function updateBillboardQuery(
  billboardId: string,
  label: string,
  primaryImageUrl: string,
  imageUrls: string[],
): Promise<ApiResponse<BillboardType>> {
  try {
    const billboardData = await db
      .update(billboard)
      .set({
        label: label,
        primaryImageUrl: primaryImageUrl,
        imageUrls: imageUrls,
      })
      .where(eq(billboard.id, billboardId))
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
// *******************  deleteBillboardQuery  ***********
// ******************************************************

export async function deleteBillboardQuery(
  billboardId: string,
): Promise<ApiResponse<BillboardType>> {
  try {
    const billboardData = await db
      .delete(billboard)
      .where(eq(billboard.id, billboardId))
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
