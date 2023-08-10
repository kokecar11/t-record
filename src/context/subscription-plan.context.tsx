import { type Signal, createContextId } from "@builder.io/qwik";
import type { TypeSubscriptionPlan } from "~/models";

//TODO:REVISAR EL CONTEXT
export const TypeSubscriptionContext = createContextId<Signal<TypeSubscriptionPlan>>('type.subscription-context');