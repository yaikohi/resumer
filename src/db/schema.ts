/**
 * ************************************************************************************
 * How to save timestamps in sqlite
 * @see https://www.sqlitetutorial.net/sqlite-date/
 * ************************************************************************************
 * Drizzle docs
 * @see https://orm.drizzle.team/docs/
 * ************************************************************************************
 */
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

/*
 *********************************************************************
 * AuthJS required tables ********************************************
 *********************************************************************
 */

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

/*
 *********************************************************************
 * Custom tables *****************************************************
 *********************************************************************
 */
export const resumes = sqliteTable("resumes", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt: text("createdAt").default(new Date().toISOString()).notNull(),
});

export const replies = sqliteTable("replies", {
  id: text("id").notNull().primaryKey(),
  content: text("content").notNull(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resumeId: text("resumeId")
    .references(() => resumes.id, { onDelete: "cascade" })
    .notNull(),
  replyId: text("replyId").references((): AnySQLiteColumn => replies.id),
  createdAt: text("createdAt").default(new Date().toISOString()).notNull(),
});

export const usernames = sqliteTable("usernames", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  username: text("username").notNull(),
  createdAt: text("createdAt").default(new Date().toISOString()).notNull(),
});

/**
 * *********************************************************************
 * Relations ***********************************************************
 ***********************************************************************
 */

export const usersRelations = relations(users, ({ one, many }) => ({
  resumes: many(resumes),
  replies: many(replies),
  username: one(usernames, {
    fields: [users.id],
    references: [usernames.userId],
  }),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  author: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
  author: one(users, {
    fields: [replies.userId],
    references: [users.id],
  }),
}));

export const usernamesRelations = relations(usernames, ({ one }) => ({
  user: one(users, {
    fields: [usernames.userId],
    references: [users.id],
  }),
}));
