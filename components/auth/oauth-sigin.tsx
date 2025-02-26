"use client";

import { Button } from "../ui/button";
import { DEFAULT_SIGNIN_REDIRECT } from "@/lib/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

const OauthSignIn = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<"google" | null>(null);

  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = async (provider: "google") => {
    try {
      setIsLoading(provider);
      await signIn(provider, {
        callbackUrl: callbackUrl || DEFAULT_SIGNIN_REDIRECT,
      });
    } catch (error) {
      // Toast notification can be added here
      console.error("OAuth error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex-center flex-col gap-4">
      <Button
        variant="outline"
        size="lg"
        className="w-full font-medium"
        onClick={() => onClick("google")}
        disabled={isLoading !== null}
      >
        {isLoading === "google" ? (
          <div className="flex-center gap-2">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            Signing in...
          </div>
        ) : (
          <div className="flex-center gap-2">
            <FaGoogle className="h-5 w-5" />
            Sign in with Google
          </div>
        )}
      </Button>
    </div>
  );
};

export default OauthSignIn;
