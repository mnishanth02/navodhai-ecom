import Footer from "@/components/common/footer";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { checkAuth, getAllStoresByUserId, validateSpecificStore } from "@/lib/helper/store-helper";
import { redirect } from "next/navigation";

interface StoreLayoutProps {
  params: Promise<{ storeId: string }>;
  children: React.ReactNode;
}

const StoreLayout = async ({ children, params }: StoreLayoutProps) => {
  const { storeId } = await params;

  const user = await checkAuth();
  const store = await validateSpecificStore(storeId);
  const allStores = await getAllStoresByUserId();

  if (!user || !store) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} stores={allStores} currentStoreId={storeId} />
      <SidebarInset>
        <Header storeName={store.name} />
        <div className="container-md flex-1">{children}</div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StoreLayout;
