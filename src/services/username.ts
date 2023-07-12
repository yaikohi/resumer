import { eq } from "drizzle-orm";
import { db } from "~/db";
import { usernames } from "~/db/schema";

export const addUsernameToDb = async (userId: string, username: string) => {
  console.log("Adding username to db:", username);
  return await db
    .insert(usernames)
    .values({
      id: crypto.randomUUID(),
      userId,
      username,
    })
    .run();
};

export const getUsernameByIdFromDb = async (userId: string) => {
  console.log("Retrieving username from db.\nuserId:", userId);
  return await db
    .selectDistinct()
    .from(usernames)
    .where(eq(usernames.id, userId))
    .get();
};
