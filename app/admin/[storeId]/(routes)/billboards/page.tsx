import Loader from "@/components/common/loader";
import { getAllBillBoardByStoreIdQuery } from "@/data/data-access/billboard.queries";
import { format } from "date-fns";
import { Suspense } from "react";
import BillboardClient from "./components/client";
import type { BillboardColumn } from "./components/columns";

interface BillboardPageProps {
  params: Promise<{ storeId: string }>;
}

const BilboardPage = async ({ params }: BillboardPageProps) => {
  const { storeId } = await params;
  const billboards = await getAllBillBoardByStoreIdQuery(storeId);

  const formattedBillboards: BillboardColumn[] = billboards.success
    ? (billboards.data ?? []).map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }))
    : [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <BillboardClient data={formattedBillboards.length > 0 ? formattedBillboards : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default BilboardPage;
