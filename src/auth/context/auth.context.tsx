import { createContextId } from "@builder.io/qwik";
import { type Session } from "supabase-auth-helpers-qwik";
import type { Subscription } from '~/models';


export interface SubscriptionUser {
    session: Session
    subscription: Subscription
}

export const AuthSessionContext = createContextId<Session | null | any>('auth.session-context');
