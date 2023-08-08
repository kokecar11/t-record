import { type Signal, createContextId } from "@builder.io/qwik";
import type { TypeSubscription } from "../models/toggle-pricing.model";

export const TypeSubsContext = createContextId<Signal<TypeSubscription>>('yearly');