import Footer from "@/components/common/footer";
import Navbar from "@/components/header/navbar";
import { validateSpecificStore } from "@/lib/helper/store-helper";
import { redirect } from "next/navigation";

interface StoreLayoutProps {
  params: Promise<{ storeId: string }>;
  children: React.ReactNode;
}

const StoreLayout = async ({ children, params }: StoreLayoutProps) => {
  const { storeId } = await params;

  const store = await validateSpecificStore(storeId);

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default StoreLayout;
