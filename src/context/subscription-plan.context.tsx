import { type Signal, createContextId } from "@builder.io/qwik";
import type { TypeSubscriptionPlan } from "~/models";

export const TypeSubscriptionContext = createContextId<Signal<TypeSubscriptionPlan>>('yearly');