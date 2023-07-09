import { serverAuth$ } from "@builder.io/qwik-auth";
import GitHub from "@auth/core/providers/github";
import type { Provider } from "@auth/core/providers";

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    secret: env.get("AUTH_SECRET"),
    trustHost: true,
    session: {
      maxAge: 5 * 24 * 60 * 60,
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log("signIn callback triggered!");
        // console.log({ user, account, profile, email, credentials });
        return true;
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
  }));
