import "server-only";
import db from "@/drizzle/db";
import { images, products } from "@/drizzle/schema";
import type {
  CategoryType,
  ColorType,
  ImageType,
  NewProductType,
  ProductType,
  SizeType,
} from "@/drizzle/schema/store";
import type { ApiResponse } from "@/types/api";
import { desc, eq } from "drizzle-orm";

// ******************************************************
// *******************  getProductByIdQuery ****************
// ******************************************************

export type ProductWithImages = ProductType & {
  images: ImageType[];
};
export async function getProductByIdQuery(
  productId: string,
): Promise<ApiResponse<ProductWithImages>> {
  try {
    const productData = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        images: true,
      },
    });

    if (productData) {
      return {
        success: true,
        data: productData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Product not found",
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
// ************* getAllProductsByStoreIdQuery ***********
// ******************************************************
type ProductWithDetails = ProductType & {
  category: CategoryType;
  size: SizeType;
  color: ColorType;
};

export async function getAllProductsByStoreIdQuery(
  storeId: string,
): Promise<ApiResponse<ProductWithDetails[]>> {
  try {
    const productsData = await db.query.products.findMany({
      where: eq(products.storeId, storeId),
      orderBy: [desc(products.createdAt)],
      with: {
        category: true,
        size: true,
        color: true,
      },
    });

    if (productsData) {
      return {
        success: true,
        data: productsData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No products found for this store",
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
// *******************  createProductQuery  ****************
// ******************************************************

export async function createProductQuery(
  data: NewProductType,
  imagesData: { url: string }[],
): Promise<ApiResponse<ProductType>> {
  try {
    const productData = await db
      .insert(products)
      .values(data)
      .returning()
      .then((res) => res[0] ?? null);

    if (imagesData.length > 0) {
      await db
        .insert(images)
        .values(
          imagesData.map((image) => ({
            productId: productData.id,
            url: image.url,
          })),
        )
        .returning()
        .then((res) => res[0] ?? null);
    }

    if (productData) {
      return {
        success: true,
        data: productData,
        message: "Product created successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Product creation failed",
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
// ***************** updateProductQuery  **************
// ******************************************************

export async function updateProductQuery(
  productId: string,
  data: NewProductType,
): Promise<ApiResponse<ProductType>> {
  try {
    const productData = await db
      .update(products)
      .set(data)
      .where(eq(products.id, productId))
      .returning()
      .then((res) => res[0] ?? null);

    if (productData) {
      return {
        success: true,
        data: productData,
        message: "Product updated successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Product update failed",
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
// *******************  deleteProductQuery  ***********
// ******************************************************

export async function deleteProductQuery(productId: string): Promise<ApiResponse<ProductType>> {
  try {
    const productData = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()
      .then((res) => res[0] ?? null);

    if (productData) {
      return {
        success: true,
        data: productData,
        message: "Product deleted successfully",
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Product deletion failed",
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
