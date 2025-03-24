import Footer from "@/components/common/footer";
import { Header } from "@/components/header";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default RootLayout;
