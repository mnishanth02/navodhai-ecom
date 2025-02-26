// import { env } from "@/data/env/server-env";
// import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// const sql = neon(env.DATABASE_URL!);

// const db = drizzle(sql);

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1); // Exit with an error code
  }
}

seed();
