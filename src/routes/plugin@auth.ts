import { serverAuth$ } from "@builder.io/qwik-auth";
import type { Provider } from "@auth/core/providers";
import GitHub from "@auth/core/providers/github";
import { db } from "~/db";
import DrizzleAdapter from "~/adapters/DrizzleAdapter";
import { accounts, sessions, users, verificationTokens } from "~/db/schema";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    secret: env.get("AUTH_SECRET"),
    trustHost: true,
    session: {
      maxAge: 5 * 24 * 60 * 60,
    },
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async signIn({ user, account, profile, email, credentials }) {
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
    events: {
      async signIn(message) {
        console.log("signIn event triggered!");
        console.log({ message });
      },
    },
    providers: [
      GitHub({
        clientId: env.get("GITHUB_ID")!,
        clientSecret: env.get("GITHUB_SECRET")!,
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
  }));
