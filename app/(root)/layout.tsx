import { validateUserStore } from "@/data/helper/store-helper";
import { redirect } from "next/navigation";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const { store } = await validateUserStore();

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{ children }</>;
};

export default SetupLayout;
