import { validateSpecificStore } from "@/lib/helper/store-helper";

interface StoreLayoutProps {
  params: Promise<{ storeId: string }>;
  children: React.ReactNode;
}

const StoreLayout = async ({ children, params }: StoreLayoutProps) => {
  const { storeId } = await params;

  await validateSpecificStore(storeId);

  return (
    <div className="flex-center min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default StoreLayout;
