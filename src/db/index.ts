import { drizzle } from "drizzle-orm/libsql";
import { type Client as LibsqlClient, createClient } from "@libsql/client/web";
import z from "zod";

const dbEnvSchema = z.object({
  LIBSQL_DB_URL: z.string(),
  LIBSQL_DB_AUTH_TOKEN: z.string(),
});

const devDbEnvSchema = z.object({
  DEV_LIBSQL_DB_URL: z.string(),
  DEV_LIBSQL_DB_AUTH_TOKEN: z.string(),
});

/**
 * Checks node_env for prod or dev and handles vars accordingly.
 */
export const getDb = () => {
  if (process.env.NODE_ENV === "development") {
    const schema = devDbEnvSchema.safeParse(process.env);

    if (!schema.success) {
      throw new Error("??? your auth token is not there buddy");
    }
    const client: LibsqlClient = createClient({
      url: schema.data.DEV_LIBSQL_DB_URL,
      authToken: schema.data.DEV_LIBSQL_DB_AUTH_TOKEN,
    });

    return drizzle(client);
  } else {
    // PRODUCTION
    const schema = dbEnvSchema.safeParse(process.env);

    if (!schema.success) {
      throw new Error("??? your auth token is not there buddy");
    }
    const client: LibsqlClient = createClient({
      url: schema.data.LIBSQL_DB_URL,
      authToken: schema.data.LIBSQL_DB_AUTH_TOKEN,
    });

    return drizzle(client);
  }
};

export const db = getDb();
export type DbClient = typeof db;
