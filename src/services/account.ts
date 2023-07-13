import { eq } from "drizzle-orm"
import { db } from "~/db"
import { accounts } from "~/db/schema"

type GetAccountByIdServiceParams = { userId: string }
export const getAccountFromDbService = async ({ userId }: GetAccountByIdServiceParams) => {
    return await db.select().from(accounts).where(eq(accounts.userId, userId)).get()
}