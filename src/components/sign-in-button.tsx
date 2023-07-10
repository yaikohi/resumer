import { component$ } from "@builder.io/qwik";
import { useAuthSignin } from "~/routes/plugin@auth";

export const SignInButton = component$(() => {
  const signIn = useAuthSignin();
  return (
    <>
      <button
        onClick$={() =>
          signIn.submit({
            providerId: "github",
            options: { callbackUrl: "/" },
          })}
        class="px-3 py-2 bg-secondary text-secondary-foreground rounded-full"
      >
        Sign in
      </button>
    </>
  );
});
