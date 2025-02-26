import CardWrapper from "./card-wrapper";
import { SignUpForm } from "./signup-form";

const SignUpFormProvider = () => {
  return (
    <CardWrapper
      headerLabel="Sign up to Navodhai Store"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/sign-in"
    >
      <SignUpForm />
    </CardWrapper>
  );
};

export default SignUpFormProvider;
