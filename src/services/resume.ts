import { db } from "~/db";
import { resumes } from "~/db/schema";
import type { NewResume, Resume } from "~/db/types";

/**
 * Creates a new resume (post) in the database.
 * This is where the uuid is generated.
 *
 */
export const postResume = async ({
  content,
  userId,
}: Pick<NewResume, "content" | "userId">): Promise<Resume> => {
  return await db
    .insert(resumes)
    .values({
      id: crypto.randomUUID(),
      content: content,
      userId: userId,
      createdAt: new Date().toISOString(),
    })
    .returning()
    .get();
};
