import SignInFormProvider from "@/components/auth/signin-form-provider";
import Loader from "@/components/common/loader";
import { Suspense } from "react";

export const metadata = {
  title: "Sign In | Navodhai",
  description: "Sign in to your Navodhai account",
};

const SignInPage = async () => {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Suspense fallback={<Loader />}>
        <SignInFormProvider />
      </Suspense>
    </div>
  );
};

export default SignInPage;
