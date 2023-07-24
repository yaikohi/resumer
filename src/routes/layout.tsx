import { component$, Slot } from "@builder.io/qwik";
import {  routeLoader$ } from "@builder.io/qwik-city";
import { type InitialValues } from "@modular-forms/qwik";
import { z } from "zod";
// import { postReply } from "~/services/reply";

/** Resume reply loader & action & forms */

export const resumeReplySchema = z.object({
  content: z
    .string()
    .min(1, "Please enter something to post a resume!")
    .max(200, "That's too many characters for a resume!"),
  resumeId: z.string(),
});
export type TResumeReplySchema = z.infer<typeof resumeReplySchema>;

export const useResumeReplyLoader = routeLoader$<
  InitialValues<TResumeReplySchema>
>(() => {
  return {
    content: "",
    resumeId: "",
  };
});


/** Root Layout */
export default component$(() => {
  return (
    <>
      <div class="flex justify-between flex-row">
        <main class="max-w-xl flex flex-col mx-auto border-border border-[1px]  w-full">
          <Slot />
        </main>
      </div>
    </>
  );
});
