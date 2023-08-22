import type{ CookieOptions } from "@builder.io/qwik-city";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const TWITCH_CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET
export const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID


export const cookieUserSession = '_user';
export const cookieProvider = '_provider';

export const cookiesOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 432000,
    path: '/',
    sameSite: 'strict',
};