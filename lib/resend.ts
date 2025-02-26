import "server-only";

import { VERIFICATION_TOKEN_EXP_MIN } from "./config/constants";
import ForgotPasswordEmail from "@/components/emails/forgot-password-email";
import SignupEmail from "@/components/emails/signup-email";
import VerifyEmail from "@/components/emails/verify-email";
import { env as clientEnv } from "@/data/env/client-env";
import { env as serverEnv } from "@/data/env/server-env";
import { Resend } from "resend";

export const resend = new Resend(serverEnv.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "Navodhai Store <onboarding@resend.dev>",
    to: "delivered@resend.dev", // TODO - need to update with proper email in production
    // to: [email],
    subject: "Welcome to Navodhai Store - Verify Your Email",
    react: VerifyEmail({
      token,
      verificationTokenExpMin: VERIFICATION_TOKEN_EXP_MIN,
      baseUrl: clientEnv.NEXT_PUBLIC_SERVER_URL,
    }),
  });
};

export const sendForgotPasswordEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "reset@navodhai.store",
    to: "delivered@resend.dev", // TODO - need to update with proper email in production
    // to: [email],
    subject: "Reset Your Password - Navodhai store",
    react: await ForgotPasswordEmail({
      token,
      verificationTokenExpMin: VERIFICATION_TOKEN_EXP_MIN,
      baseUrl: clientEnv.NEXT_PUBLIC_SERVER_URL,
    }),
  });
};

export const sendSignupUserEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "signup@navodhai.store",
    to: "delivered@resend.dev", // TODO - need to update with proper email in production
    // to: [email],
    subject: "Signup to Navodhai Store - Verify Your Email",
    react: await SignupEmail({
      token,
      verificationTokenExpMin: VERIFICATION_TOKEN_EXP_MIN,
      baseUrl: clientEnv.NEXT_PUBLIC_SERVER_URL,
    }),
  });
};
