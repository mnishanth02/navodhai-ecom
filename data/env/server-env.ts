import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_DRIZZLE_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    // ARCJET_KEY: z.string().min(1),
    // TEST_IP_ADDRESS: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: process.env,
});
