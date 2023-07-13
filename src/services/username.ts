import { eq } from "drizzle-orm";
import { db } from "~/db";
import { usernames } from "~/db/schema";
import type { Username, NewUsername } from "~/db/types"

/** Non exported statement only used in this file. */
async function createUsernameTable({ id,
  userId,
  username,
  createdAt }: NewUsername) {
  return await db.insert(usernames).values({
    id,
    userId,
    username,
    createdAt,
  }).run()
}

async function getUsernameTableByUserId({ userId }: Pick<Username, "userId">) {
  return await db.select().from(usernames).where(
    eq(usernames.userId, userId),
  ).get();
}

type NewUsernameParams = Pick<NewUsername, "userId" | "username">
export async function createUsernameService({ userId, username }: NewUsernameParams) {
  console.log("Adding username to db:", username);
  return await createUsernameTable({
    id: crypto.randomUUID(),
    userId,
    username,
    createdAt: new Date().toISOString()
  })
}

type UsernameExistsParams = Pick<Username, "userId">
export async function checkIfUsernameExistsService({ userId }: UsernameExistsParams): Promise<boolean> {
  console.log("Checking if username exists in turso...");
  const username = await getUsernameTableByUserId({ userId })

  console.log('username fetched from db:\n', { username })
  return Boolean(username);
}