import type { RequestEvent } from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/auth/auth";


export const onGet = async (event: RequestEvent) => {
  removeAuthCookies(event);
  throw event.redirect(302, '/login/');
};