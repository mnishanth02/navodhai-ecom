"use client";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge, badgeVariants } from "../ui/badge";
import { Button } from "../ui/button";
import { useCopyToClipboard } from "@/hooks/general/use-copy-to-clipboard";
import { VariantProps } from "class-variance-authority";
import { Copy, Server } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const varientMap: Record<ApiAlertProps["variant"], VariantProps<typeof badgeVariants>["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant = "public" }) => {
  const variantClass = varientMap[variant];
  const text = textMap[variant];
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  useEffect(() => {
    if (isCopied) {
      toast.success("Copied to clipboard");
    }
  }, [isCopied]);

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex gap-3">
        { title }
        <Badge variant={ variantClass }>{ text }</Badge>
      </AlertTitle>
      <AlertDescription className="mt-2 flex">
        <code className="bg-muted relative rounded px-3 py-1.5 font-mono text-sm font-semibold">{ description }</code>
        <Button variant="outline" size="icon" onClick={ () => copyToClipboard(description) } disabled={ isCopied }>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
