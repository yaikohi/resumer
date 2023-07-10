import { component$ } from "@builder.io/qwik";
import { useAuthSignout } from "~/routes/plugin@auth";

export const SignOutButton = component$(() => {
  const signOut = useAuthSignout();
  return (
    <>
      <button
        onClick$={() => signOut.submit({ callbackUrl: "/" })}
        class="px-3 py-2 bg-secondary text-secondary-foreground"
      >
        Sign Out
      </button>
    </>
  );
});
