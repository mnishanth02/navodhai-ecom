import CardWrapper from "@/components/auth/card-wrapper";
import { SignInForm } from "@/components/auth/signin-form";
import Loader from "@/components/common/loader";
import { Suspense } from "react";

export const metadata = {
  title: "Email Sign In | Navodhai",
  description: "Sign in to your Navodhai account using email",
};

const EmailSignInPage = () => {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Suspense fallback={<Loader />}>
        <CardWrapper
          headerLabel="Sign in to your account"
          backButtonLabel="Don't have an account?"
          backButtonHref="/auth/sign-up"
          className="w-full max-w-md"
        >
          <SignInForm />
        </CardWrapper>
      </Suspense>
    </div>
  );
};

export default EmailSignInPage;
