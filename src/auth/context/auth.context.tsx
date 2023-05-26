import { createContextId } from "@builder.io/qwik";
import { type Session } from "supabase-auth-helpers-qwik";


export const AuthSessionContext = createContextId<Session | null | any>('auth.session-context');
