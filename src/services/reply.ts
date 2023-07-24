import { db } from "~/db";
import { replies } from "~/db/schema";
import type { Resume } from "~/db/types";

/**
 * Creates a new resume (post) in the database.
 * This is where the uuid is generated.
 */
export const postReply = async ({
  content,
  userId,
  resumeId,
}: {
  content: string;
  userId: string;
  resumeId: string;
}): Promise<Resume> => {
  console.log("Inserting resume into db.");
  return await db
    .insert(replies)
    .values({
      id: crypto.randomUUID(),
      resumeId,
      content,
      userId,
    })
    .returning()
    .get();
};
