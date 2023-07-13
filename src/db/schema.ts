/**
 * How to save timestamps in sqlite
 * @see https://www.sqlitetutorial.net/sqlite-date/
 *
 * Drizzle docs
 * @see https://orm.drizzle.team/docs/
 */
import type { AdapterAccount } from "@auth/core/adapters";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("userId").references(() => users.id, {
      onDelete: "cascade",
    }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({ compoundKey: primaryKey(vt.identifier, vt.token) }),
);

export const defaultSchema = {
  users: users,
  accounts: accounts,
  sessions: sessions,
  verificationTokens: verificationTokens,
};

export type DefaultSchema = typeof defaultSchema;
export interface CustomSchema extends DefaultSchema {}

/**
 * Resume
 *
 * @field id - string
 * @field userId  -  string
 * @field content - string
 * @field createdAt - string
 */
export const resumes = sqliteTable("resumes", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt: text("createdAt").default(new Date().toISOString()).notNull(),
});

/**
 * Username (table)
 *
 * @field id - string
 * @field userId - string
 * @field username - string
 * @field createdAt - string
 */
export const usernames = sqliteTable("usernames", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId").references(() => users.id, {
    onDelete: "cascade",
  }).notNull(),
  username: text("username").notNull(),
  createdAt: text("createdAt").default(new Date().toISOString()).notNull(),
});
