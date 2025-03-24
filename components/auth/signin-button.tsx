"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import SignInFormProvider from "./signin-form-provider";

interface SignInButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const SignInButton: FC<SignInButtonProps> = ({ children, asChild, mode = "redirect" }) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/sign-in");
  };
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="w-auto border-none bg-transparent p-0">
          <DialogTitle hidden />
          <SignInFormProvider />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default SignInButton;
