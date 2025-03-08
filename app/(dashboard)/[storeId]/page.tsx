import { validateSpecificStore } from "@/data/helper/store-helper";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const StoreDashboardPage = async ({ params }: DashboardPageProps) => {
  const { storeId } = await params;

  const store = await validateSpecificStore(storeId);

  if (!store) {
    redirect("/");
  }

  return (
    <div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        Store Name - { store.name }
      </div>
    </div>
  );
};

export default StoreDashboardPage;
