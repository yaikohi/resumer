import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <div class="flex justify-between flex-row">
        {
          /*        <div class="flex flex-col max-w-xs">
          <h1 class="text-3xl">Resumer</h1>
          <p>Send resumes on resumer, a qwik twitter.</p>
        </div>
        */
        }
        <main class="max-w-xl flex flex-col mx-auto border-border border-[1px]  w-full">
          <Slot />
        </main>
        {/* div class="flex flex-col">right</div> */}
      </div>
    </>
  );
});
