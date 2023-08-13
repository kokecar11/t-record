import { createContextId } from "@builder.io/qwik";
import type { SubscriptionUser } from "~/models";

export const SubscriptionUserContext = createContextId<SubscriptionUser>('user.subscription-context');