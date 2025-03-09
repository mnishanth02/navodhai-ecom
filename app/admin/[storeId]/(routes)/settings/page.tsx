import Loader from "@/components/common/loader";
import SettingsForm from "./components/settings-form";
import { validateSpecificStore } from "@/data/helper/store-helper";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { storeId } = await params;

  const store = await validateSpecificStore(storeId);

  if (!store) {
    redirect("/admin");
  }

  return (
    <Suspense fallback={ <Loader /> }>

      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SettingsForm initialData={ store } />
        </div>
      </div>
    </Suspense>
  );
};

export default SettingsPage;
