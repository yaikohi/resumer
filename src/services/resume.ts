import { desc, eq } from "drizzle-orm";
import { db } from "~/db";
import { resumes, usernames, users } from "~/db/schema";
import type { NewResume, Resume } from "~/db/types";
// import { ratelimit } from "~/lib/ratelimiter";

/**
 * Creates a new resume (post) in the database.
 * This is where the uuid is generated.
 */
export const postResume = async ({
  content,
  userId,
}: Pick<NewResume, "content" | "userId">): Promise<Resume> => {
  // const { success } = await ratelimit.limit(userId);
  // if (!success) {
  //   throw new Error("Ratelimit exceeded; try again in 10 seconds.");
  // }
  console.log("Inserting resume into db.");
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

/**
 * Retrieves all resumes that are viewable by non-signed-in users.
 */
export const getPublicResumes = async () => {
  console.log("Retrieving all resumes from db.");
  return await db
    .select({
      id: resumes.id,
      content: resumes.content,
      user: {
        id: resumes.userId,
        username: usernames.username,
        name: users.name,
        email: users.email,
        image: users.image,
      },
      createdAt: resumes.createdAt,
    })
    .from(resumes)
    .innerJoin(users, eq(users.id, resumes.userId))
    .innerJoin(usernames, eq(users.id, usernames.userId))
    .limit(100)
    .orderBy(desc(resumes.createdAt))
    .all();
};

/**
 * Deletes the resume by id
 */
export const deleteResumeFromDb = async (resumeId: string) => {
  console.log("Deleted resume with id:", resumeId);
  return await db.delete(resumes).where(eq(resumes.id, resumeId)).run();
};
