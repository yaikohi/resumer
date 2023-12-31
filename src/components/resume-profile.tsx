import { component$ } from "@builder.io/qwik";
import {
  formAction$,
 type InitialValues,
  useForm,
  zodForm$,
} from "@modular-forms/qwik";
import { cn } from "~/lib/utils";
import { useAuthSession } from "~/routes/plugin@auth";
import { PostResumeTextArea } from "./post-resume";
import { routeLoader$, z } from "@builder.io/qwik-city";
import { postResume } from "~/services/resume";

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

export const ResumeProfile = component$(() => {
  const session = useAuthSession();

  const [postResumeform, { Form, Field }] = useForm<TResumeCreateForm>({
    loader: useResumeCreateLoader(),
    action: useResumeCreateAction(),
    validate: zodForm$(resumeCreateSchema),
  });

  return (
    <>
      <div class={cn("flex", "w-full", "p-2")}>
        {/* User profile section */}
        <div class="my-8">
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

        {/* Creating a new resume!*/}
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
      </div>
    </>
  );
});
