import * as schema from "./schema";
import { env } from "@/data/env/server-env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = env.DATABASE_URL;

const sql = neon(DATABASE_URL);

const db = drizzle(sql, { schema });

export default db;
