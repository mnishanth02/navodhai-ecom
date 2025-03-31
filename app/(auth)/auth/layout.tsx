import { cn } from "@/lib/utils";

export const metadata = {
  title: {
    template: "%s | Navodhai",
    default: "Authentication | Navodhai",
  },
  description: "Secure authentication for your Navodhai account",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn("min-h-screen flex-center bg-gradient-to-b from-background to-secondary/20")}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
