import { z } from "zod";

/** Node server only check. */
export const isDev = process.env.NODE_ENV === "development"

/** (In Node env) retrieves .env variables for db. */
export function getNodeDbVars() {
  const dbSchema = z.object({
    LIBSQL_DB_URL: z.string(),
    LIBSQL_DB_AUTH_TOKEN: z.string(),
  });

  const dbVars = dbSchema.safeParse(
    isDev
      ? {
        LIBSQL_DB_URL: process.env["DEV_LIBSQL_DB_URL"],
        LIBSQL_DB_AUTH_TOKEN: process.env["DEV_LIBSQL_DB_AUTH_TOKEN"],
      }
      : {
        LIBSQL_DB_URL: process.env["LIBSQL_DB_URL"],
        LIBSQL_DB_AUTH_TOKEN: process.env["LIBSQL_DB_AUTH_TOKEN"],
      },
  );

  if (!dbVars.success) {
    throw new Error("Something went wrong reading the dbvars.");
  }

  return dbVars.data;
}
/** (In Node env) retrieves .env variables for github auth. */
export function getNodeGithubAuthVars() {
  const githubAuthSchema = z.object({
    GITHUB_SECRET: z.string(),
    GITHUB_ID: z.string(),
  });

  const githubAuthVars = githubAuthSchema.safeParse(
    isDev
      ? {
        GITHUB_SECRET: process.env["DEV_GITHUB_SECRET"],
        GITHUB_ID: process.env["DEV_GITHUB_ID"],
      }
      : {
        GITHUB_SECRET: process.env["GITHUB_SECRET"],
        GITHUB_ID: process.env["GITHUB_ID"],
      },
  );

  if (!githubAuthVars.success) {
    throw new Error("Something went wrong reading the githubAuthVars!");
  }

  return githubAuthVars.data;
}
