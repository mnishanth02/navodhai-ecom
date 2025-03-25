"use client";

import { DEFAULT_SIGNIN_REDIRECT } from "@/lib/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "../ui/button";

const OauthSignIn = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<"google" | null>(null);

  const callbackUrl = searchParams.get("callbackUrl");
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;
    if (error === "OAuthAccountNotLinked") {
      toast.error("This account is already in use with different credentials");
    } else {
      toast.error("Authentication failed. Please try again");
    }
  }, [error]);

  const onClick = async (provider: "google") => {
    try {
      setIsLoading(provider);
      await signIn(provider, {
        callbackUrl: callbackUrl || DEFAULT_SIGNIN_REDIRECT,
      });
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Authentication failed. Please try again");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex w-full flex-col space-y-3">
      <Button
        size="lg"
        variant="outline"
        className="relative w-full border-input font-medium shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-secondary/30"
        onClick={() => onClick("google")}
        disabled={isLoading !== null}
      >
        {isLoading === "google" ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FaGoogle className="h-4 w-4" />
            <span>Continue with Google</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default OauthSignIn;
