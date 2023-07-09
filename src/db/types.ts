import type { InferModel } from "drizzle-orm";
import type { resumes, users } from "./schema";

/** User */
export type User = InferModel<typeof users, "select">;
export type NewUser = InferModel<typeof users, "insert">;

/** Resume (post) */
export type Resume = InferModel<typeof resumes, "select">;
export type NewResume = InferModel<typeof resumes, "insert">;
