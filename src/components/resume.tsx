import { component$ } from "@builder.io/qwik";
import { getRelativeTimeString } from "~/lib/dates";

interface ResumeProps {
  name?: string | null;
  username: string;
  content: string;
  date: string;
  image?: string | null;
}
/**
 * A resume is a 'tweet' on resumer.
 */
export const Resume = component$<ResumeProps>(
  ({ name, username, content, date, image }) => {
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
              <div class="flex flex-row gap-1">
                <p class="text-sm font-medium">
                  {name ? `${name}` : `${username}`}
                </p>
                <p class="text-sm">@{username}</p>
              </div>
              <p class="text-xs">
                {getRelativeTimeString(new Date(date), new Date())}
              </p>
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
