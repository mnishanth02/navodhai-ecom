import SignUpFormProvider from "@/components/auth/signup-form-provider";
import Loader from "@/components/common/loader";
import { Suspense } from "react";

export const metadata = {
  title: "Sign Up | Navodhai",
  description: "Create a new Navodhai account",
};

const SignUpPage = () => {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-8">
      <Suspense fallback={<Loader />}>
        <SignUpFormProvider />
      </Suspense>
    </div>
  );
};

export default SignUpPage;
