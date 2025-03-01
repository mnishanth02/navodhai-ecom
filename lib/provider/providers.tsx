"use client";

import { ModalProvider } from "./moda-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@ui/sonner";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextTopLoader color="#15803d" shadow="0 0 10px #15803d,0 0 5px #15803d" />
      {/* <TooltipProvider delayDuration={0}>{children}</TooltipProvider> */}
      <SessionProvider>
        <ModalProvider />
        {children}
      </SessionProvider>
      <Toaster position="bottom-right" richColors duration={3000} toastOptions={{ style: { textAlign: "center" } }} />
      {/* TODO : pls uncomment before production */}
      {/* <Analytics /> */}
      {/* <SpeedInsights /> */}
    </ThemeProvider>
  );
}
