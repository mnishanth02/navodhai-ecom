import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import type { FC, ReactNode } from "react";
import { BackButton } from "../common/back-button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import AuthCardHeader from "./auth-header";

interface CardWrapperProps {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const CardWrapper: FC<CardWrapperProps> = ({
  children,
  backButtonHref,
  backButtonLabel,
  headerLabel,
}) => {
  return (
    <div className="flex-center flex-col gap-4">
      <div className="mb-4 flex-center gap-4">
        <Image
          src={"/logo.png"}
          alt="logo"
          quality={100}
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div className={cn("h2", font.className)}>{siteConfig.name}</div>
      </div>
      <Card className="z-20 min-w-[450px] shadow-md">
        <CardHeader>
          <AuthCardHeader label={headerLabel} />
        </CardHeader>
        <CardContent>
          <div>{children}</div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
      <div className="mt-3 text-balance text-center text-muted-foreground text-sm">
        By signing in, you agree to our terms and policies
      </div>
    </div>
  );
};

export default CardWrapper;
