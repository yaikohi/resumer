/**
 * How to save timestamps in sqlite
 * @see https://www.sqlitetutorial.net/sqlite-date/
 * 
 * Drizzle docs
 * @see https://orm.drizzle.team/docs/
 */
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Profile
 * 
 * @field id - integer
 * @field username - string
 * @field name - string
 * @field createdAt - string ('ISO8601')
 */
export const profileTable = sqliteTable("profile", {
  id: integer("id").primaryKey(),
  username: text("username"),
  name: text("name"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

/**
 * Poe 
 * 
 * @field id - integer
 * @field content - string
 * @field profileId - FK - string 
 * @field createdAt - string ('ISO8601')
 */
export const poeTable = sqliteTable("poe", {
  id: integer("id").primaryKey(),
  profileId: integer("profile_id").references(() => profileTable.id),
  content: text("content").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});
