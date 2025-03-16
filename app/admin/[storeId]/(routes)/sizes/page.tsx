import Loader from "@/components/common/loader";
import { getAllSizesByStoreIdQuery } from "@/data/data-access/size.queries";
import { format } from "date-fns";
import { Suspense } from "react";
import SizesClient from "./components/client";
import type { SizesColumn } from "./components/columns";

interface SizePageProps {
  params: Promise<{ storeId: string }>;
}

const SizePage = async ({ params }: SizePageProps) => {
  const { storeId } = await params;
  const sizes = await getAllSizesByStoreIdQuery(storeId);

  const formattedSizes: SizesColumn[] = sizes.success
    ? (sizes.data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }))
    : [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<Loader />}>
          <SizesClient data={formattedSizes.length > 0 ? formattedSizes : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default SizePage;
