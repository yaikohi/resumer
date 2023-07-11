import {
  $,
  component$,
  useOnDocument,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  HiEllipsisHorizontalOutline,
  HiTrashOutline,
} from "@qwikest/icons/heroicons";
import { getRelativeTimeString } from "~/lib/dates";
import { cn } from "~/lib/utils";

interface ResumeProps {
  name?: string | null;
  username: string;
  content: string;
  date: string;
  image?: string | null;
  signedInUserOwnsResume: boolean;
}
/**
 * A resume is a 'tweet' on resumer.
 */
export const Resume = component$<ResumeProps>(
  ({ name, username, content, date, image, signedInUserOwnsResume }) => {
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
      }),
    );
    return (
      <>
        <div class="flex mx-auto max-w-xl border-border border-[1px]">
          <div class="max-w-[48px] m-2">
            {image
              ? (
                <img
                  src={image}
                  alt={username}
                  class="aspect-square rounded-full"
                  height={48}
                  width={48}
                />
              )
              : (
                <div class="h-[48px] aspect-square  rounded-full bg-secondary">
                </div>
              )}
          </div>
          <div class="flex-col flex w-full p-2">
            <div class="flex justify-between place-items-center">
              <div class="flex flex-row gap-2 place-items-center w-full">
                <p class="text-sm font-medium min-w-max">
                  {name ? `${name}` : `${username}`}
                </p>
                <div class="flex flex-row place-items-center justify-between w-full">
                  <p class="font-mono text-sm text-muted-foreground">
                    @{username}
                    {" • "}
                    {getRelativeTimeString(new Date(date), new Date())}
                  </p>
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
                        "rounded-xl",
                      )}
                    >
                      <div class="flex flex-col">
                        <button
                          class={cn(
                            "flex",
                            "rounded-xl",
                            "place-items-center",
                            "hover:bg-muted/50",
                            "p-2",
                          )}
                        >
                          {signedInUserOwnsResume && (
                            <div class="ml-1 mr-2">
                              <HiTrashOutline />
                            </div>
                          )}
                          <span>{"Delete"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col h-full pt-1 pb-8">
              <p class="text-sm break-all">{content}</p>
            </div>
          </div>
        </div>
      </>
    );
  },
);
