import Loader from "@/components/common/loader";
import { getAllOrderByStoreIdQuery } from "@/data/data-access/order.queries";
import { currencyFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { Suspense } from "react";
import OrderClient from "./components/client";
import type { OrderColumn } from "./components/columns";

interface OrdersPageProps {
  params: Promise<{ storeId: string }>;
}

const OrdersPage = async ({ params }: OrdersPageProps) => {
  const { storeId } = await params;
  const ordersData = await getAllOrderByStoreIdQuery(storeId);

  const formattedOrders: OrderColumn[] =
    ordersData.success && ordersData.data
      ? ordersData.data?.map((item) => ({
          id: item.id,
          phone: item.phone,
          address: item.address,
          products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
          totalPrice: currencyFormatter.format(
            item.orderItems.reduce((total, item) => {
              return total + Number(item.product.price);
            }, 0),
          ),
          isPaid: item.isPaid,
          createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }))
      : [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <OrderClient data={formattedOrders.length > 0 ? formattedOrders : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrdersPage;
