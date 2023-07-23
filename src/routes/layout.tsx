import { component$, Slot } from "@builder.io/qwik";

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
