import "server-only"
import { SQL, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
