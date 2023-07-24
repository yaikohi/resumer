import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { Form, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import {
  HiChatBubbleOvalLeftOutline,
  HiEllipsisHorizontalOutline,
  HiTrashOutline,
} from "@qwikest/icons/heroicons";
import { getRelativeTimeString } from "~/lib/dates";
import { cn } from "~/lib/utils";
import { deleteResumeFromDb } from "~/services/resume";

interface ResumeProps {
  id: string;
  name?: string | null;
  username: string;
  content: string;
  date: string;
  image?: string | null;
  signedInUserOwnsResume: boolean;
}

const resumeDeleteSchema = z.object({ id: z.string() });

export const useDeleteResumeAction = globalAction$(async (data) => {
  const resumeId = data.id;

  await deleteResumeFromDb(resumeId);
}, zod$(resumeDeleteSchema));

/**
 * A resume is a 'tweet' on resumer.
 */
export const Resume = component$<ResumeProps>(
  ({ id, name, username, content, date, image, signedInUserOwnsResume }) => {
    const deleteResume = useDeleteResumeAction();
    const dropdownRef = useSignal<Element>();
    const showContextMenu = useSignal(false);

    /**This currently runs for every rendered component... which is not ideal */
    useOnDocument(
      "click",
      $((event) => {
        if (dropdownRef.value) {
          if (event.target !== dropdownRef.value) {
            showContextMenu.value = false;
          }
        }
      })
    );
    return (
      <>
        <div class="flex mx-auto max-w-xl border-border border-[1px]">
          <div class="max-w-[48px] m-2">
            {image ? (
              <ResumeAvatarImage imageUrl={image} altText={username} />
            ) : (
              <PlaceholderImage />
            )}
          </div>
          <div class="flex-col flex w-full p-2">
            <div class="flex justify-between place-items-center">
              <a href={`/${username}`}>
                <div class="flex flex-row gap-2 place-items-center w-full">
                  <p class="text-sm font-medium min-w-max">
                    {name ? `${name}` : `${username}`}
                  </p>
                  <p class="font-mono text-sm text-muted-foreground">
                    @{username}
                    {" • "}
                    {getRelativeTimeString(new Date(date), new Date())}
                  </p>
                </div>
              </a>
              <div class="relative">
                <button
                  onClick$={() => {
                    showContextMenu.value = !showContextMenu.value;
                    console.log(showContextMenu.value);
                  }}
                >
                  <HiEllipsisHorizontalOutline />
                </button>
                <div
                  ref={dropdownRef}
                  class={cn(
                    `${!showContextMenu.value && "hidden"}`,
                    "absolute",
                    "w-48",
                    "bg-background",
                    "top-2 -left-[168px]",
                    "border-border border-2",
                    "rounded-xl"
                  )}
                >
                  <div class="flex flex-col">
                    {signedInUserOwnsResume && (
                      <button
                        onClick$={async () => await deleteResume.submit({ id })}
                        class={cn(
                          "flex",
                          "rounded-xl",
                          "place-items-center",
                          "hover:bg-muted/50",
                          "p-2"
                        )}
                      >
                        <div class="ml-1 mr-2">
                          <HiTrashOutline />
                        </div>

                        <span>{"Delete"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col h-full pt-1 pb-8">
              <p class="text-sm break-all">{content}</p>
            </div>
            <Reply />
          </div>
        </div>
      </>
    );
  }
);

// export const Like = component$(() => {
//   const open = useSignal(false);
//   return (
//     <button
//       class="py-2 px-3"
//       onClick$={() => {
//         open.value = !open.value;
//         console.log(open.value);
//       }}
//     >
//       <HiHeartOutline />
//     </button>
//   );
// });
// export const useResumeReplyAction = globalAction$(
//   async (data, requestEvent) => {
//     const session = requestEvent.sharedMap.get("session");
//     // await postReply({
//     //   userId: session.user.id,
//     //   content: data.content,
//     //   resumeId: data.resumeId,
//     // });
//     console.log({
//       data,
//       session,
//     });
//   },
//   zodForm$(resumeReplySchema)
// );

export const Reply = component$(() => {
  const showReplyModal = useSignal(false);
  const replyRef = useSignal<Element>();

  useOnDocument(
    "click",
    $((event) => {
      if (replyRef.value) {
        const clickedNode = event.target;
        if (!clickedNode) return;

        /** `event.target` actually becomes a `Node` type so this is possible; I don't know how to properly type it otherwise so I cast it into this type. */
        const containsNode = replyRef.value.parentNode?.children[0].contains(
          clickedNode as Node
        );

        // console.log({ containsNode });
        // console.log({ before: showReplyModal.value });

        if (clickedNode !== replyRef.value && !containsNode) {
          showReplyModal.value = false;
          // console.log({ after: showReplyModal.value });
        }
      }
    })
  );
  // const [postReplyForm, { Form, Field }] = useForm<TResumeReplySchema>({
  //   loader: useResumeReplyLoader(),
  //   action: useResumeReplyAction(),
  //   validate: zodForm$(resumeReplySchema),
  // });
  return (
    <>
      <div
        class={cn(
          `${!showReplyModal.value ? "hidden" : "flex"}`,
          "fixed",
          "z-0",
          "justify-center",
          "place-items-center",
          "inset-0",
          "bg-slate-950/80"
        )}
      >
        <div
          ref={replyRef}
          class={cn("bg-background", "p-8", "rounded-xl", "z-100")}
        >
          <div class={cn("w-full", "min-w-max")}>
            <Form
              class={cn("flex flex-col", "place-items-center", "gap-2")}
              // onSubmit$={() => reset(postReplyForm)}
            >
              <textarea
                placeholder="What would you like to say to this person?"
                id="reply"
                aria-errormessage="reply-error"
                name="reply"
                class={cn(
                  "flex min-h-[80px] w-full",
                  "px-3 py-2 rounded-md",
                  "text-sm",
                  "resize-none",
                  "bg-transparent ring-offset-background",
                  "border border-input",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />

              <div class="flex flex-row relative place-items-center w-full justify-end ">
                <div class="absolute -top-2 left-0">
                  {/* {postReplyForm.submitting && (
                    <>
                      <p class="text-sm italic">loading...</p>
                    </>
                  )}

                  {postReplyForm.submitCount >= 200 && (
                    <>
                      <p class="text-sm text-destructive">
                        That's too many characters.
                      </p>
                    </>
                  )} */}
                </div>
                <button
                  // disabled={postReplyForm.submitting}
                  class={cn(
                    "inline-flex items-center justify-center ",
                    "px-4 py-3 rounded-3xl",
                    "bg-primary ring-offset-background ",
                    "text-sm text-primary-foreground font-medixum",
                    "transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50"
                  )}
                >
                  Reply
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <button
        class="py-2 pr-3"
        onClick$={() => (showReplyModal.value = !showReplyModal.value)}
      >
        <HiChatBubbleOvalLeftOutline />
      </button>
    </>
  );
});

// export const Reresume = component$(() => {
//   return (
//     <button class="py-2 px-3">
//       <HiArrowPathOutline />
//     </button>
//   );
// });

interface ResumeAvatarImageProps {
  imageUrl: string;
  altText: string;
}
export const ResumeAvatarImage = component$<ResumeAvatarImageProps>(
  ({ imageUrl, altText }) => {
    return (
      <img
        src={imageUrl}
        alt={altText}
        class="aspect-square rounded-full"
        height={48}
        width={48}
      />
    );
  }
);
export const PlaceholderImage = component$(() => {
  return <div class="h-[48px] aspect-square  rounded-full bg-secondary"></div>;
});
