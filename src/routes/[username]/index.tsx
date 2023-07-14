import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Resume } from "~/components/resume";
import { useAuthSession } from "../plugin@auth";
import { SignOutButton } from "~/components/sign-out-button";
import { SignInButton } from "~/components/sign-in-button";
import { getUserInfoByUsername } from "~/services/user";

export const useGetUserInfo = routeLoader$(async (requestEvent) => {
  const { username } = requestEvent.params;
  const userInfo = await getUserInfoByUsername({ username });
  return userInfo;
});
export default component$(() => {
  const userInfo = useGetUserInfo();
  const session = useAuthSession();
  console.log(userInfo.value);
  const user = userInfo.value.user;
  const username = userInfo.value.username;
  return (
    <>
      <div class="flex flex-col p-4 mt-20">
        <div class="pr-2">
          <img src={user.image} class="rounded-full" width={120} height={120} />
        </div>
        <div class="flex flex-col">
          <p class="font-bold">{user.name}</p>
          <p class="font-mono">@{username}</p>
        </div>
      </div>
      {/* Container of list of resumes*/}
      <div class="mt-8">
        {/* List of resumes */}
        <ul class="flex flex-col w-full">
          {userInfo.value.resumes.map((resume) => (
            <li class="w-full mx-auto" key={resume.id}>
              <Resume
                id={resume.id}
                signedInUserOwnsResume={user.id ===
                  session.value?.user.id}
                name={user.name}
                username={username}
                content={resume.content}
                date={resume.createdAt}
                image={user.image}
              />
            </li>
          ))}
        </ul>
        <div class="fixed w-full bottom-0">
          <div class="w-full backdrop-blur-sm bg-secondary/20">
            {session.value?.user.name ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
      </div>
    </>
  );
});
