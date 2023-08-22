import type{ CookieOptions } from "@builder.io/qwik-city";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY


export const cookieUserSession = '_user';
export const cookieProvider = '_provider';

export const cookiesOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 432000,
    path: '/',
    sameSite: 'strict',
};