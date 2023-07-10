import { drizzle } from "drizzle-orm/libsql";
import { type Client as LibsqlClient, createClient } from "@libsql/client/web";
import { getNodeDbVars } from "~/lib/env";

export const getDb = () => {
  const schema = getNodeDbVars();

  const client: LibsqlClient = createClient({
    url: schema.LIBSQL_DB_URL,
    authToken: schema.LIBSQL_DB_AUTH_TOKEN,
  });

  return drizzle(client);
};

export const db = getDb();
export type DbClient = typeof db;
