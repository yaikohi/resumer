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
      createdAt: new Date().toISOString()
    })
    .run();
};

export const checkIfUsernameExists = async (userId: string): Promise<boolean> => {
  console.log("Checking if username exists in turso");
  const username = await db.select().from(usernames).where(
    eq(usernames.userId, userId),
  ).get();

  return !!username;
};