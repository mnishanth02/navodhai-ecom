import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_DRIZZLE_URL: z.string().url(),
    NODE_ENV: z.string().default("development"),
    RESEND_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    CLOUDFLARE_R2_ENDPOINT: z.string().url(),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
    CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1),
    CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),

    // ARCJET_KEY: z.string().min(1),
    // TEST_IP_ADDRESS: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: process.env,
});
