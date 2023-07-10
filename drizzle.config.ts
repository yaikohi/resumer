import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default {
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.LIBSQL_DB_URL as string,
    authToken: process.env.LIBSQL_DB_AUTH_TOKEN as string,
  },
} satisfies Config;
