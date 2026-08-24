import "server-only";
import postgres from "postgres";
import { cleanConnectionString } from "./connection-string";

export const sql = postgres(cleanConnectionString(process.env.DATABASE_URL!), {
  ssl: "require",
  prepare: false, // Neon's pooled connection (pgbouncer) doesn't support prepared statements
});
