import type { InferModel } from "drizzle-orm";
import type { accounts, resumes, usernames, users } from "./schema";

/** User */
export type User = InferModel<typeof users, "select">;
export type NewUser = InferModel<typeof users, "insert">;


/** Username */
export type Username = InferModel<typeof usernames, "select">;
export type NewUsername = InferModel<typeof usernames, "insert">;

/** Resume (post) */
export type Resume = InferModel<typeof resumes, "select">;
export type NewResume = InferModel<typeof resumes, "insert">;

/** Account */
export type Account = InferModel<typeof accounts, "select">;
export type NewAccount = InferModel<typeof accounts, "insert">;
