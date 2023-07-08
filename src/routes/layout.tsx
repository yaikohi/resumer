import type { Session } from "@auth/core/types";
import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

/** This caching did something so that logging in/out on development doesn't work? */
// export const onGet: RequestHandler = async ({ cacheControl }) => {
//   // Control caching for this request for best performance and to reduce hosting costs:
//   // https://qwik.builder.io/docs/caching/
//   cacheControl({
//     // Always serve a cached response by default, up to a week stale
//     staleWhileRevalidate: 60 * 60 * 24 * 7,
//     // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
//     maxAge: 5,
//   });
// };

export const onRequest: RequestHandler = (event) => {
  const session: Session | null = event.sharedMap.get("session");
  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(302, `/api/auth/signin`);
  }
};

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
