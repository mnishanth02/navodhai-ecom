import { cn } from "@/lib/utils";
import type { FC } from "react";

interface AuthHeaderProps {
  label: string;
}

const AuthCardHeader: FC<AuthHeaderProps> = ({ label }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-2">
      <h1 className={cn("h4")}>Welcome Princess</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default AuthCardHeader;
