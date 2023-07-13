import { component$, Slot } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm, zodForm$ } from "@modular-forms/qwik";
import { PostResumeTextArea } from "~/components/post-resume";
import { Resume } from "~/components/resume";
import { SignInButton } from "~/components/sign-in-button";
import { SignOutButton } from "~/components/sign-out-button";
import { cn } from "~/lib/utils";
import { useAuthSession } from "~/routes/plugin@auth";
import { getPublicResumes, postResume } from "~/services/resume";

export const useGetResumes = routeLoader$(async () => {
  return await getPublicResumes();
});

export default component$(() => {
  const session = useAuthSession();
  const resumes = useGetResumes();
  return (
    <>
      <div class="p-4">
        <h1 class="text-3xl">Resumer</h1>
        <p>Send resumes on resumer, a qwik twitter.</p>
      </div>

      {session.value?.user?.name && (
        <>
          <ResumeProfile>
            <ResumeCreator />
          </ResumeProfile>
        </>
      )}

      {/* Container of list of resumes*/}
      <div class="mt-8">
        {/* List of resumes */}
        <ul class="flex flex-col w-full">
          {resumes.value.map((resume) => (
            <li class="w-full mx-auto" key={resume.id}>
              <Resume
                id={resume.id}
                signedInUserOwnsResume={resume.user.id ===
                  session.value?.user.id}
                name={resume.user.name}
                username={resume.user.username}
                content={resume.content}
                date={resume.createdAt}
                image={resume.user.image}
              />
            </li>
          ))}
        </ul>
        <div class="fixed w-full bottom-0">
          <div class="w-full backdrop-blur-sm bg-secondary/20">
            {session.value?.user.name ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
      </div>
    </>
  );
});

{/* The profile header component of the page that shows when you're logged in.*/}
export const ResumeProfile = component$(() => {
  const session = useAuthSession();
  return (
    <>
      <div class={cn("flex", "w-full", "p-2")}>
        {/* User profile section */}
        <div class="mt-2 mr-2">
          <div class="flex place-items-center gap-2">
            {session.value?.user.image && (
              <img
                width={48}
                height={48}
                class="aspect-square rounded-full"
                src={session.value.user.image}
                alt={`${session.value.user.name} picture`}
              />
            )}
          </div>
        </div>
        <Slot />
      </div>
    </>
  );
});

{/* Where the resumes are created... */}
const resumeCreateSchema = z.object({
  content: z
    .string()
    .min(1, "Please enter something to post a resume!")
    .max(200, "That's too many characters for a resume!"),
});

type TResumeCreateForm = z.infer<typeof resumeCreateSchema>;

export const useResumeCreateAction = formAction$<TResumeCreateForm>(
  async (data, requestEvent) => {
    const session = requestEvent.sharedMap.get("session");
    await postResume({
      userId: session.user.id,
      content: data.content,
    });
  },
  zodForm$(resumeCreateSchema),
);

export const useResumeCreateLoader = routeLoader$<
  InitialValues<TResumeCreateForm>
>(() => {
  return {
    content: "",
  };
});

export const ResumeCreator = component$(() => {
  const [postResumeform, { Form, Field }] = useForm<TResumeCreateForm>({
    loader: useResumeCreateLoader(),
    action: useResumeCreateAction(),
    validate: zodForm$(resumeCreateSchema),
  });

  return (
    <>
      <div class={cn("w-full")}>
        <Form class="flex flex-col place-items-center gap-2">
          <Field name="content">
            {(field, props) => {
              // this clears the form after submitting.
              // 1. submit -> 2. signal update -> 3. rerender <PostResumeTextArea> component -> 4. empty form.
              // it seems to be a little buggy still :/
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
                "text-sm text-primary-foreground font-medixum",
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
    </>
  );
});

export const head: DocumentHead = {
  title: "resumer",
  meta: [
    {
      name: "description",
      content: "Resumer is a Qwik twitter-clone wherein you send resumes.",
    },
  ],
};
