import Loader from "@/components/common/loader";
import { getAllColorsByStoreIdQuery } from "@/data/data-access/color.queries";
import { format } from "date-fns";
import { Suspense } from "react";
import ColorsClient from "./components/client";
import type { ColorsColumn } from "./components/columns";

interface ColorsPageProps {
  params: Promise<{ storeId: string }>;
}

const ColorsPage = async ({ params }: ColorsPageProps) => {
  const { storeId } = await params;
  const colors = await getAllColorsByStoreIdQuery(storeId);

  const formattedColors: ColorsColumn[] = colors.success
    ? (colors.data ?? []).map((item) => ({
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
          <ColorsClient data={formattedColors.length > 0 ? formattedColors : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default ColorsPage;
