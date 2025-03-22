import { getBillboardByIdQuery } from "../data-access/billboard.queries";
import {
  type ProductWithDetails,
  getAllProductsByStoreIdQuery,
  getProductByIdQuery,
} from "../data-access/products.queries";
import { env } from "../env/server-env";

interface Query {
  categoryId?: string;
  sizeId?: string;
  colorId?: string;
  isFeatured?: boolean;
  minPrice?: string;
  maxPrice?: string;
}

export const getProducts = async (query: Query): Promise<ProductWithDetails[] | []> => {
  const result = await getAllProductsByStoreIdQuery(env.APP_STORE_ID, query);

  if (result.success && result.data) {
    return result.data;
  }
  return [];
};

export const getProduct = async (productId: string): Promise<ProductWithDetails | null> => {
  const result = await getProductByIdQuery(productId);

  if (result.success && result.data) {
    return result.data;
  }

  return null;
};

export const getBillboard = async (billboardId: string) => {
  const result = await getBillboardByIdQuery(billboardId);

  if (result.success && result.data) {
    return result.data;
  }
  return null;
};
