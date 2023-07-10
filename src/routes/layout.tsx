import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <div class="flex justify-between flex-row">
        {/* <div class="flex flex-col">left</div> */}
        <main class="max-w-xl flex flex-col mx-auto border-border border-[1px] h-screen w-full">
          <Slot />
        </main>
        {/* div class="flex flex-col">right</div> */}
      </div>
    </>
  );
});
