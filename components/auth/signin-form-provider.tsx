import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import CardWrapper from "./card-wrapper";
import OauthSignIn from "./oauth-sigin";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SignInFormProvider = () => {
  return (
    <CardWrapper
      headerLabel="Sign in to your account using one of the options below."
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
    >
      <OauthSignIn />
      <div className="relative my-4 flex items-center justify-center">
        <Separator className="absolute w-full" />
        <span className="text-muted-foreground bg-background z-10 px-2 text-xs whitespace-nowrap">
          Or continue with email
        </span>
      </div>
      <Link
        className={cn(
          buttonVariants({
            variant: "secondary",
            size: "lg",
            className: "w-full font-medium",
          })
        )}
        href="/auth/sign-in/email"
      >
        Sign In with Email
      </Link>
    </CardWrapper>
  );
};

export default SignInFormProvider;
