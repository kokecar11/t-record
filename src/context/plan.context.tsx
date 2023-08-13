import { type Signal, createContextId } from "@builder.io/qwik";
import type { TypeSubscription } from "~/models";

//TODO:REVISAR EL CONTEXT
export const TypeSubscriptionContext = createContextId<Signal<TypeSubscription>>('type.subscription-context');