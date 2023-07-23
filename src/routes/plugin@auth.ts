import { serverAuth$ } from "@builder.io/qwik-auth";
import type { Provider } from "@auth/core/providers";
import GitHub from "@auth/core/providers/github";
import { db } from "~/db";
import DrizzleAdapter from "~/adapters/DrizzleAdapter";
import { accounts, sessions, users, verificationTokens } from "~/db/schema";
import { z } from "zod";
import { getAccountProviderIdFromImageUrl, getUsernameFromGithubByAccountProviderId } from "~/lib/getUsernameById";
import {
  createUsernameService,
  checkIfUsernameExistsService,
} from "~/services/username";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => {
    const isDev = env.get("NODE_ENV") !== undefined ||
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
        "Something went wrong with parsing the .env variables for github oauth.",
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
      events: {
        // async signIn({ user, account }) {
        // console.log("User signed in!", { user })
        // // if username exists in db, dont fetch username.
        // const usernameExists = await checkIfUsernameExistsService({ userId: user.id });

        // if (usernameExists) {
        //   if (!account) {
        //     const dbAcc = await getAccountFromDbService({ userId: user.id })
        //     const username = (
        //       await getUsernameFromGithubByAccountProviderId({ providerAccountId: dbAcc.providerAccountId })
        //     ).login;

        //     await createUsernameService({ userId: user.id, username });
        //     console.log("username added:", username);
        //   } else {
        //     const username = (
        //       await getUsernameFromGithubByAccountProviderId({ providerAccountId: account?.providerAccountId })
        //     ).login;

        //     await createUsernameService({ userId: user.id, username });
        //     console.log("username added:", username);
        //   }
        // }
        // },
        async createUser({ user }) {
          console.log("New user created!", { user })
          // if username exists in db, dont fetch username.
          const usernameExists = await checkIfUsernameExistsService({ userId: user.id });

          if (usernameExists === false) {
            console.log("retrieving accountProviderId...")

            if (user.image === null || user.image === undefined) {
              console.log('Unable to create a new username.')
            }

            const providerAccountId = getAccountProviderIdFromImageUrl({ imageUrl: user.image as string })

            const username = (
              await getUsernameFromGithubByAccountProviderId({ providerAccountId })
            ).login;

            await createUsernameService({ userId: user.id, username });
            console.log("username added:", username);
          }
        }
      },
      callbacks: {
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
