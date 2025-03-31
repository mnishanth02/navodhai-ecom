import type { FC } from "react";

interface AuthHeaderProps {
  label: string;
  title?: string;
}

const AuthCardHeader: FC<AuthHeaderProps> = ({ label, title = "Welcome" }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-2 text-center">
      <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">{label}</p>
    </div>
  );
};

export default AuthCardHeader;
