import { drizzle } from "drizzle-orm/libsql";
import { type Client as LibsqlClient, createClient } from "@libsql/client/web";
import z from "zod";

const dbEnvSchema = z.object({
  LIBSQL_DB_URL: z.string(),
  LIBSQL_DB_AUTH_TOKEN: z.string(),
});

export const getDb = () => {
  const schema = dbEnvSchema.safeParse(process.env);

  if (!schema.success) {
    throw new Error("??? your auth token is not there buddy");
  }
  const client: LibsqlClient = createClient({
    url: schema.data.LIBSQL_DB_URL,
    authToken: schema.data.LIBSQL_DB_AUTH_TOKEN,
  });

  return drizzle(client);
};

export const db = getDb();
export type DbClient = typeof db;
