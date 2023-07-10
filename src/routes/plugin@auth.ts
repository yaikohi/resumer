import { serverAuth$ } from "@builder.io/qwik-auth";
import type { Provider } from "@auth/core/providers";
import GitHub from "@auth/core/providers/github";
import { db } from "~/db";
import DrizzleAdapter from "~/adapters/DrizzleAdapter";
import { accounts, sessions, users, verificationTokens } from "~/db/schema";
import { z } from "zod";
import { getUsernameById } from "~/lib/getUsernameById";
import { addUsernameToDb } from "~/services/username";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => {
    const isDev =
      env.get("NODE_ENV") !== undefined ||
      env.get("NODE_ENV") === "development";

    const githubEnvSchema = z.object({
      GITHUB_SECRET: z.string(),
      GITHUB_ID: z.string(),
    });

    const schema = isDev
      ? githubEnvSchema.safeParse({
          GITHUB_SECRET: env.get("DEV_GITHUB_SECRET"),
          GITHUB_ID: env.get("DEV_GITHUB_ID"),
        })
      : githubEnvSchema.safeParse({
          GITHUB_SECRET: env.get("GITHUB_SECRET"),
          GITHUB_ID: env.get("GITHUB_ID"),
        });

    if (!schema.success) {
      throw new Error(
        "Something went wrong with parsing the .env variables for github oauth."
      );
    }

    const GITHUB_SECRET = schema.data.GITHUB_SECRET;
    const GITHUB_ID = schema.data.GITHUB_ID;

    return {
      secret: env.get("AUTH_SECRET"),
      trustHost: true,
      session: {
        maxAge: 5 * 24 * 60 * 60,
      },
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async signIn({ user, account, profile, email, credentials }) {
          // if username exists in db, dont fetch username.
          const existingUsername = await getUsernameById(user.id);
          if (!existingUsername) {
            const username = (
              await getUsernameById(account?.providerAccountId as string)
            ).login as string;

            await addUsernameToDb(user.id, username);
            console.log("username added:", username);
          }

          return true;
        },
        async session({ session, token, user }) {
          const updatedSessionObj = {
            accessToken: token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            },
            expires: session.expires,
          };
          return updatedSessionObj;
        },
      },
      providers: [
        GitHub({
          clientId: GITHUB_ID,
          clientSecret: GITHUB_SECRET,
          authorization: {
            params: {
              scope: "read:user user:email",
            },
          },
        }),
      ] as Provider[],
      adapter: DrizzleAdapter(db, {
        users,
        accounts,
        sessions,
        verificationTokens,
      }),
    };
  });
