import { eq } from "drizzle-orm";
import { db } from "~/db";
import { resumes, usernames, users } from "~/db/schema";
import { User } from "~/db/types";

/** Check if the user exists in turso */
export const checkIfUserExistsInDb = async (
  userId: string,
): Promise<boolean> => {
  return !!db.select().from(users).where(eq(users.id, userId)).get();
};

type GetUserInfoByIdParams = Pick<User, "id">;
export async function getUserInfoById(
  { id }: GetUserInfoByIdParams,
) {
  return await db.select().from(users).where(eq(users.id, id)).get();
}

type GetUserInfoByUsernameParams = { username: string };
export async function getUserInfoByUsername(
  { username }: GetUserInfoByUsernameParams,
) {
  const usernameRow = await db.select().from(
    usernames,
  ).where(eq(usernames.username, username)).get();

  const userResumes = await db.select().from(resumes).where(
    eq(resumes.userId, usernameRow.userId),
  ).all();

  const userProfile = await db.select().from(users).where(
    eq(users.id, usernameRow.userId),
  ).get();

  return {
    username,
    user: userProfile,
    resumes: userResumes,
  };
}
