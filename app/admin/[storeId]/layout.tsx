import Footer from "@/components/common/footer";
import Loader from "@/components/common/loader";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAllStoresByUserId, getStoreAndUser } from "@/data/helper/store-helper";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface StoreLayoutProps {
  params: Promise<{ storeId: string }>;
  children: React.ReactNode;
}

const StoreLayout = async ({ children, params }: StoreLayoutProps) => {
  const { storeId } = await params;

  // Validate storeId format to prevent unnecessary DB calls
  if (!storeId || typeof storeId !== "string" || storeId.length < 10) {
    redirect("/admin");
  }

  // Get store data
  const { store, user } = await getStoreAndUser(storeId);

  // Get all stores for the sidebar
  const allStores = await getAllStoresByUserId();

  // If store doesn't exist or doesn't belong to the user, redirect to admin
  if (!store) {
    redirect("/admin");
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<Loader />}>
        <AppSidebar user={user} stores={allStores} currentStoreId={storeId} />
      </Suspense>
      <SidebarInset>
        <Suspense fallback={<Loader />}>
          <Header storeName={store.name} />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StoreLayout;
