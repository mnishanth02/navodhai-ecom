import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface SignupEmailProps {
  token: string;
  verificationTokenExpMin: number;
  baseUrl: string;
}

export const SignupEmail = ({ token, verificationTokenExpMin, baseUrl }: SignupEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Navodhai Store - Verify Your Email</Preview>
      <Tailwind>
        <Body className="bg-zinc-100 font-sans">
          <Container className="mx-auto p-5">
            <Section className="mx-auto max-w-600 rounded-lg bg-white shadow-sm">
              {/* Header */}
              <Section className="rounded-t-lg bg-blue-500 px-8 py-10 text-center">
                <Heading className="m-0 text-2xl font-bold text-white">Navodhai Store</Heading>
              </Section>

              {/* Content */}
              <Section className="px-8 py-10">
                <Text className="mb-5 text-base leading-6 text-gray-800">Hi there,</Text>
                <Text className="mb-5 text-base leading-6 text-gray-800">
                  Welcome to Navodhai Store! We are excited to have you join our community. To get started, please
                  verify your email address by clicking the button below.
                </Text>
                <Text className="mb-8 text-base leading-6 text-gray-800">
                  This verification link will expire in <strong>{verificationTokenExpMin} minutes</strong>.
                </Text>

                <Section className="py-8 text-center">
                  <Button
                    className="rounded-md bg-green-600 px-8 py-3 text-center font-bold text-white hover:bg-green-700"
                    href={`${baseUrl}/auth/verify-email?token=${token}`}
                  >
                    Verify Email Address
                  </Button>
                </Section>

                {/* Security Notice */}
                <Section className="mb-5 rounded-md bg-slate-50 p-5">
                  <Text className="m-0 text-sm leading-5 text-slate-500">
                    If you didn&apos;t create an account with Navodhai Store, you can safely ignore this email.
                  </Text>
                </Section>
              </Section>

              <Hr className="my-2 border-gray-200" />

              {/* Footer */}
              <Section className="rounded-b-lg bg-slate-50 px-8 py-6">
                <Text className="mb-2 text-center text-sm leading-5 text-slate-500">
                  Need help? Contact our support team
                </Text>
                <Text className="m-0 text-center text-xs text-slate-400">
                  © {new Date().getFullYear()} Navodhai Store. All rights reserved.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SignupEmail;
