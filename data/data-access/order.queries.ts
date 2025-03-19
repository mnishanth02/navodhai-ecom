import "server-only";
import db from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import type { OrderItemType, OrderType, ProductType } from "@/drizzle/schema/store";
import type { ApiResponse } from "@/types/api";
import { desc, eq } from "drizzle-orm";

// ******************************************************
// *******************  getBillboardById ****************
// ******************************************************

export async function getBillboardByIdQuery(orderId: string): Promise<ApiResponse<OrderType>> {
  try {
    const orderData = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    });

    if (orderData) {
      return {
        success: true,
        data: orderData,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "Order not found",
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
// ************* getAllOrderByStoreIdQuery ***********
// ******************************************************

// Define the extended type that includes relations
type OrderWithOrderItemAndProduct = OrderType & {
  orderItems: (OrderItemType & {
    product: ProductType;
  })[];
};

export async function getAllOrderByStoreIdQuery(
  storeId: string,
): Promise<ApiResponse<OrderWithOrderItemAndProduct[]>> {
  try {
    const ordersData = await db.query.orders.findMany({
      where: eq(orders.storeId, storeId),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
    });

    console.log("Order data structure:", JSON.stringify(ordersData[0], null, 2));

    if (ordersData && ordersData.length > 0) {
      return {
        success: true,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        data: ordersData as any,
      };
    }

    return {
      success: false,
      error: {
        code: 404,
        message: "No Orders found for this store",
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
