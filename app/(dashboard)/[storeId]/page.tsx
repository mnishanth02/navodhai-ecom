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

  return <div>StoreDashboardPage - { store.name }</div>;
};

export default StoreDashboardPage;
