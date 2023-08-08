import { type Signal, createContextId } from "@builder.io/qwik";
import type { TypeSubscription } from "~/models";

export const TypeSubscriptionContext = createContextId<Signal<TypeSubscription>>('yearly');