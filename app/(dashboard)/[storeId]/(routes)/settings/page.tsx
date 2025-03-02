import { validateSpecificStore } from "@/lib/helper/store-helper";
import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { storeId } = await params;

  const store = await validateSpecificStore(storeId);

  if (!store) {
    redirect("/");
  }

  return <div>SettingsPage - {store.name}</div>;
};

export default SettingsPage;
