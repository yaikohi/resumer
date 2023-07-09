/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Adapter, AdapterAccount } from "@auth/core/adapters";
import type { DbClient } from "../db";
import type { CustomSchema } from "~/db/schema";
import { defaultSchema } from "~/db/schema";
import { eq, and } from "drizzle-orm";

/** @return { import("next-auth/adapters").Adapter } */
export default function DrizzleAdapter(
  client: DbClient,
  schema?: Partial<CustomSchema>
): Adapter {
  const { users, accounts, sessions, verificationTokens } = {
    users: schema?.users ?? defaultSchema.users,
    accounts: schema?.accounts ?? defaultSchema.accounts,
    sessions: schema?.sessions ?? defaultSchema.sessions,
    verificationTokens:
      schema?.verificationTokens ?? defaultSchema.verificationTokens,
  };

  return {
    createUser: async (data) => {
      return await client
        .insert(users)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .get();
    },
    getUser: async (data) => {
      return (
        (await client.select().from(users).where(eq(users.id, data)).get()) ??
        null
      );
    },
    getUserByEmail: async (data) => {
      return (
        (await client
          .select()
          .from(users)
          .where(eq(users.email, data))
          .get()) ?? null
      );
    },
    createSession: async (data) => {
      return await client.insert(sessions).values(data).returning().get();
    },
    getSessionAndUser: async (data) => {
      return (
        (await client
          .select({
            session: sessions,
            user: users,
          })
          .from(sessions)
          .where(eq(sessions.sessionToken, data))
          .innerJoin(users, eq(users.id, sessions.userId))
          .get()) ?? null
      );
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.");
      }

      return await client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .get();
    },
    updateSession: async (data) => {
      return await client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get();
    },
    linkAccount: async (rawAccount) => {
      const updatedAccount = await client
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .get();

      /**
       * I have no idea how to fix this
       *
       * src: https://github.com/nextauthjs/next-auth/blob/92383d5254c95910a87fb28908a6a3a8da295ae7/packages/adapter-drizzle/src/sqlite/index.ts#L140C40-L140C40
       *
       * @ts-ignore */
      const account: AdapterAccount = {
        ...updatedAccount,
        type: updatedAccount.type ?? undefined,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      };

      return account;
    },
    getUserByAccount: async (account) => {
      const dbAccount = await client
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .get();

      if (!dbAccount) return null;

      const user = await client
        .select()
        .from(users)
        .where(eq(users.id, dbAccount.userId as string))
        .get();

      return user;
    },
    deleteSession: async (sessionToken) => {
      return await (client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .get() ?? null);
    },
    createVerificationToken: async (token) => {
      return await client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .get();
    },
    useVerificationToken: async (token) => {
      try {
        return (
          (await client
            .delete(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, token.identifier),
                eq(verificationTokens.token, token.token)
              )
            )
            .returning()
            .get()) ?? null
        );
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    deleteUser: async (id) => {
      return await client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .get();
    },
    unlinkAccount: async (account) => {
      client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .run();

      return undefined;
    },
  };
}
