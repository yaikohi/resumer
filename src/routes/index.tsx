import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout,
} from "~/routes/plugin@auth";

export default component$(() => {
  const session = useAuthSession();
  return (
    <>
      <h1 class="text-3xl">Resumer</h1>
      <p>Send resumes on resumer, a qwik twitter.</p>
      {/* User profile section? */}
      {session.value?.user?.name && (
        <div class="">
          <div class="flex place-items-center gap-2">
            {session.value.user.image && (
              <img
                width={64}
                height={64}
                class="rounded-full"
                src={session.value.user.image}
                alt={`${session.value.user.name} picture`}
              />
            )}
            <p>{session.value.user.name}</p>
          </div>
        </div>
      )}

      {/* Container of list of resumes*/}
      <div class="my-8">
        {/* List of resumes */}
        <ul class="flex flex-col w-full">
          {/* Resume           <li class="w-full mx-auto">
            <Resume
              name={"bob"}
              username={"bobber"}
              date={"2023-07-07"}
              content={"This is a post on resumer! it can be long or short but I guess the maximum amount of characters will be 200 because bisky also does it like that."}
            />
            <Resume
              name={"bob"}
              username={"bobber"}
              date={"2023-07-07"}
              content={"This is a post on resumer! it can be long or short but I guess the maximum amount of characters will be 200 because bisky also does it like that."}
            />
            <Resume
              name={"bob"}
              username={"bobber"}
              date={"2023-07-07"}
              content={"This is a post on resumer! it can be long or short but I guess the maximum amount of characters will be 200 because bisky also does it like that."}
            />
            <Resume
              name={"bob"}
              username={"bobber"}
              date={"2023-07-07"}
              content={"This is a post on resumer! it can be long or short but I guess the maximum amount of characters will be 200 because bisky also does it like that."}
            />
          </li>*/}
        </ul>
        <div class="flex flex-col gap-2">
          {session.value?.user?.email ? <SignOutButton /> : <SignInButton />}
        </div>
      </div>
    </>
  );
});

const SignInButton = component$(() => {
  const signIn = useAuthSignin();
  return (
    <>
      <button
        onClick$={() =>
          signIn.submit({ providerId: "github", options: { callbackUrl: "/" } })
        }
        class="px-3 py-2 bg-secondary text-secondary-foreground"
      >
        Sign in
      </button>
    </>
  );
});

const SignOutButton = component$(() => {
  const signOut = useAuthSignout();
  return (
    <>
      <button
        onClick$={() => signOut.submit({ callbackUrl: "/" })}
        class="px-3 py-2 bg-secondary text-secondary-foreground"
      >
        Sign Out
      </button>
    </>
  );
});

interface ResumeProps {
  name: string;
  username: string;
  content: string;
  date: string;
}
/**
 * A resume is a 'tweet' on resumer.
 */
export const Resume = component$<ResumeProps>(
  ({ name, username, content, date }) => {
    return (
      <>
        <div class="flex flex-col mx-auto max-w-xl border-border border-[1px]">
          <div class="flex justify-between place-items-center">
            <div class="flex flex-row gap-1">
              <p class="text-sm font-medium">{name}</p>
              <p class="text-sm">@{username}</p>
            </div>
            <p class="text-xs">{date}</p>
          </div>
          <div class="flex flex-col">
            <p>{content}</p>
            <div class="flex justify-end">
              <div class="bg-red-200 h-8 w-8"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
);
export const head: DocumentHead = {
  title: "resumer",
  meta: [
    {
      name: "description",
      content: "Resumer is a Qwik twitter-clone wherein you send resumes.",
    },
  ],
};
