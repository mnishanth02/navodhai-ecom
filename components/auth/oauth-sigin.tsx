"use client";

import { Button } from "../ui/button";
import { DEFAULT_SIGNIN_REDIRECT } from "@/lib/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

const OauthSignIn = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<"google" | null>(null);

  const callbackUrl = searchParams.get("callbackUrl");
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;
    if (error === "OAuthAccountNotLinked") {
      toast.error("This account is already in use. Please sign in.");
    } else {
      toast.error("An error occured. Please try again.");
    }
  }, [error]);

  const onClick = async (provider: "google") => {
    try {
      setIsLoading(provider);
      await signIn(provider, {
        callbackUrl: callbackUrl || DEFAULT_SIGNIN_REDIRECT,
      });
    } catch (error) {
      // Toast notification can be added here
      console.error("OAuth error:", error);
      toast.error("An error occured. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex-center flex-col gap-4">
      <Button
        size="lg"
        className="w-full font-medium "
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
