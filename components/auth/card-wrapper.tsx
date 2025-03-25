import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import type { FC, ReactNode } from "react";
import { BackButton } from "../common/back-button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import AuthCardHeader from "./auth-header";

interface CardWrapperProps {
  children: ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  className?: string;
  showFooterText?: boolean;
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
  className,
  showFooterText = true,
}) => {
  return (
    <div className="flex-center flex-col gap-3">
      <Card
        className={cn(
          "z-20 border-border/40 shadow-lg backdrop-blur-sm sm:min-w-[450px]",
          "w-full transition-all duration-300 hover:shadow-md",
          "dark:bg-card/95 dark:shadow-primary/5",
          className,
        )}
      >
        <div className="mb-2 flex-center gap-3">
          <Image
            src={"/logo.png"}
            alt="logo"
            quality={100}
            width={48}
            height={48}
            className="rounded-xl shadow-sm"
          />
          <div className={cn("font-bold text-2xl tracking-tight", font.className)}>
            {siteConfig.name}
          </div>
        </div>
        <Separator />
        <CardHeader className="space-y-1 pb-2">
          <AuthCardHeader label={headerLabel} />
        </CardHeader>
        <CardContent className="pb-3">
          <div className="w-full">{children}</div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-3">
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>

        {showFooterText && (
          <div className="mx-auto max-w-xs text-balance text-center text-muted-foreground text-sm">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CardWrapper;
