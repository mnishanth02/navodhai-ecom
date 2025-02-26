import "server-only";

import { Resend } from 'resend';
import { VERIFICATION_TOKEN_EXP_MIN } from "./config/constants";
import { env as clientEnv } from "@/data/env/client-env";
import { env as serverEnv } from "@/data/env/server-env";
import VerifyEmail from "@/components/emails/verify-email";

const resend = new Resend(serverEnv.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {

    await resend.emails.send({
        from: 'verify@navodhai.store',
        to: 'delivered@resend.dev', // TODO - need to update with proper email in production
        // to: [email],
        subject: 'Welcome to Navodhai Store - Verify Your Email',
        react: VerifyEmail({ token, verificationTokenExpMin: VERIFICATION_TOKEN_EXP_MIN, baseUrl: clientEnv.NEXT_PUBLIC_SERVER_URL }),
    });
}