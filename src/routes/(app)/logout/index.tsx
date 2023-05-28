import { component$ } from "@builder.io/qwik";
import type { DocumentHead, RequestEvent } from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/auth/auth";
import { supabase } from "~/core/supabase/supabase";



export const onGet = async (event: RequestEvent) => {
    removeAuthCookies(event);
    // await supabase.auth.signOut();

  throw event.redirect(302, '/login/');
};

export default component$(() => {
  return <span>Bye</span>;
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};