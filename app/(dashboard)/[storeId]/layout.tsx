import { auth } from "@/auth";
import { getStoreByIdQuery } from "@/lib/data-access/store-quries";
import { redirect } from "next/navigation";

interface StoreLayoutProps {
  params: Promise<{ storeId: string }>;
  children: React.ReactNode;
}

const StoreLayout = async ({ children, params }: StoreLayoutProps) => {
  const session = await auth();
  if (!session || !session.user.id) {
    redirect("/auth/sign-in");
  }
  const { storeId } = await params;

  const store = await getStoreByIdQuery(storeId, session.user.id);

  if (!store.success) {
    redirect("/");
  }

  return (
    <div className="flex-center min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default StoreLayout;
