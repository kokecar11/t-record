import { type Signal, createContextId } from "@builder.io/qwik";
import type { Subscription } from "~/models";

export const SubscriptionUserContext = createContextId<Signal<Subscription | null>>('user.subscription-context');