import { env } from "./data/env/server-env";
import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
    // ssl: false
  },
  verbose: true,
  strict: true,
} satisfies Config);
