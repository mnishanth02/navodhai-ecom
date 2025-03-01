import { auth } from "@/auth";
import { getStoreByIdUserIdQuery } from "@/lib/data-access/store-quries";
import { redirect } from "next/navigation";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session || !session.user.id) {
    redirect("/auth/sign-in");
  }
  const { data: store } = await getStoreByIdUserIdQuery(session.user.id);

  if (store?.data) {
    redirect(`/${store.data.id}`);
  }

  return <>{children}</>;
};

export default SetupLayout;
