import { createContextId } from "@builder.io/qwik";
import type { TwitchProvider } from "~/models";

export const TwitchProviderContext = createContextId<TwitchProvider>('twitch.provider-context');