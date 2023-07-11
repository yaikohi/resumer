import { type DefaultSession } from "@auth/core/types";

// Solution based on this github comment: https://github.com/nextauthjs/next-auth/discussions/6914#discussioncomment-5270151
declare module "@auth/core/types" {
  interface Session {
    user: {
      id?: string | null;
    } & DefaultSession["user"];
  }
}
