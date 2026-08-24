import "server-only";
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
  prepare: false, // Neon's pooled connection (pgbouncer) doesn't support prepared statements
});
