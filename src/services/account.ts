import { eq } from "drizzle-orm"
import { db } from "~/db"
import { accounts } from "~/db/schema"

export const getAccountById = async(userId:string) => {
    return await db.select().from(accounts).where(eq(accounts.userId, userId)).get()
}