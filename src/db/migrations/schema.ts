import {
  sqliteTable,
  primaryKey,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      pk0: primaryKey(table.provider, table.providerAccountId),
    };
  }
);

export const sessions = sqliteTable("sessions", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires").notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified"),
  image: text("image"),
});

export const verificationToken = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires").notNull(),
  },
  (table) => {
    return {
      pk0: primaryKey(table.identifier, table.token),
    };
  }
);

export const resume = sqliteTable("resume", {
  id: text("id").primaryKey().notNull(),
  userId: text("userId").references(() => users.id),
  content: text("content").notNull(),
  createdAt: text("created_at").default("2023-07-09T11:25:47.893Z"),
});
