import { config } from "dotenv";
import bcrypt from "bcryptjs";
import postgres from "postgres";

config({ path: ".env.local" });

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("Uso: ADMIN_USERNAME=... ADMIN_PASSWORD=... npx tsx scripts/create-admin.ts");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Falta DATABASE_URL en .env.local");
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",
    prepare: false,
  });

  const passwordHash = await bcrypt.hash(password, 12);

  const rows = await sql<
    { id: number }[]
  >`INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    ON CONFLICT (username) DO NOTHING
    RETURNING id`;

  if (rows.length === 0) {
    console.log(`El usuario "${username}" ya existía, no se modificó nada.`);
  } else {
    console.log(`Usuario admin "${username}" creado (id ${rows[0].id}).`);
  }

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
