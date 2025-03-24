import CardWrapper from "@/components/auth/card-wrapper";
import { SignInForm } from "@/components/auth/signin-form";

const EmailSignInPage = () => {
  return (
    <CardWrapper
      headerLabel="Sign in to your account using email"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
    >
      <SignInForm />
    </CardWrapper>
  );
};

export default EmailSignInPage;
