import { eq } from "drizzle-orm"
import { db } from "~/db"
import { users } from "~/db/schema"

/** Check if the user exists in turso */
export const checkIfUserExistsInDb = async (userId: string): Promise<boolean> => {
    return !!db.select().from(users).where(eq(users.id, userId)).get()
}