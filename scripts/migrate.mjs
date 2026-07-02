import fs from "node:fs/promises";
import pg from "pg";
import { loadLocalEnv } from "./env.mjs";

const { Pool } = pg;

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

try {
  const schema = await fs.readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  await pool.query(schema);
  console.log("Database schema applied.");
} catch (error) {
  console.error("Migration failed.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
