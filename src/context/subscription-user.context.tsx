import { createContextId } from "@builder.io/qwik";
import type { Subscription } from "~/models";

export const SubscriptionUserContext = createContextId<Subscription>('user.subscription-context');