import { drizzle } from "drizzle-orm/libsql";
import { type Client as LibsqlClient, createClient } from "@libsql/client/web";
import { getNodeDbVars } from "~/lib/env";
import * as schema from "./schema";

export const getDb = () => {
  const envs = getNodeDbVars();

  const client: LibsqlClient = createClient({
    url: envs.LIBSQL_DB_URL,
    authToken: envs.LIBSQL_DB_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
};

export const db = getDb();
export type DbClient = typeof db;
