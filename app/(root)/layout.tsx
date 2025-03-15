import { Header } from "@/components/header";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default RootLayout;
