import { eq } from "drizzle-orm";
import { db } from "~/db";
import { usernames } from "~/db/schema";

export const addUsernameToDb = async (userId: string, username: string) => {
  return await db
    .insert(usernames)
    .values({
      id: crypto.randomUUID(),
      userId,
      username,
    })
    .run();
};

export const getUsernameById = async (userId: string) => {
  return await db
    .selectDistinct()
    .from(usernames)
    .where(eq(usernames.id, userId))
    .get();
};
