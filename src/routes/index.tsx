import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { PostResumeTextArea } from "~/components/post-resume";
import { cn } from "~/lib/utils";
import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout,
} from "~/routes/plugin@auth";
import { postResume } from "~/services/resume";

const resumeSchema = z.object({
  content: z
    .string()
    .min(1, "Please enter something to post a resume!")
    .max(200, "That's too many characters for a resume!"),
});

type TResumeForm = z.infer<typeof resumeSchema>;

export const usePostResumeLoader = routeLoader$<InitialValues<TResumeForm>>(
  () => ({
    content: "",
  }),
);

export const usePostResumeAction = formAction$<TResumeForm>(
  async (data, requestEvent) => {
    const session = requestEvent.sharedMap.get("session");
    await postResume({
      userId: session.user.id,
      content: data.content,
    });
  },
  zodForm$(resumeSchema),
);

export default component$(() => {
  const session = useAuthSession();

  const [postResumeform, { Form, Field }] = useForm<TResumeForm>({
    loader: usePostResumeLoader(),
    action: usePostResumeAction(),
    validate: zodForm$(resumeSchema),
  });

  return (
    <>
      <h1 class="text-3xl">Resumer</h1>
      <p>Send resumes on resumer, a qwik twitter.</p>
      {/* User profile section? */}
      {session.value?.user?.name && (
        <div class="my-8">
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
      {/* Creating a new resume!*/}
      {session.value?.user?.name && (
        <div>
          <Form class="flex flex-col place-items-center gap-2">
            <Field name="content">
              {(field, props) => {
                // TEST IF THIS ALSO WORKS IN PROD!
                // this clears the form after submitting.
                field.value = "";
                return (
                  <>
                    <PostResumeTextArea
                      {...props}
                      name="content"
                      value={field.value}
                      error={field.error}
                    />
                  </>
                );
              }}
            </Field>
            <div class="flex flex-row relative place-items-center w-full justify-end ">
              <div class="absolute -top-2 left-0">
                {postResumeform.submitting && (
                  <>
                    <p class="text-sm italic">loading...</p>
                  </>
                )}

                {postResumeform.submitCount >= 200 && (
                  <>
                    <p class="text-sm text-destructive">
                      That's too many characters.
                    </p>
                  </>
                )}
              </div>
              <button
                disabled={postResumeform.submitting}
                class={cn(
                  "inline-flex items-center justify-center ",
                  "px-4 py-3 rounded-3xl",
                  "bg-primary ring-offset-background ",
                  "text-sm text-primary-foreground font-medium",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                Send resume
              </button>
            </div>
          </Form>
        </div>
      )}
      {/* Container of list of resumes*/}
      <div class="my-8">
        {/* List of resumes */}
        <ul class="flex flex-col w-full">
          {
            /* Resume           <li class="w-full mx-auto">
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
          </li>*/
          }
        </ul>
        <div class="absolute w-full bottom-0">
          <div class="w-full backdrop-blur-sm bg-secondary/20">
            {session.value?.user?.name ? <SignOutButton /> : <SignInButton />}
          </div>
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
          signIn.submit({
            providerId: "github",
            options: { callbackUrl: "/" },
          })}
        class="px-3 py-2 bg-secondary text-secondary-foreground rounded-full"
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
  },
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
