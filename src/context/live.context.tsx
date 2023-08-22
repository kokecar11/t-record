import { createContextId } from "@builder.io/qwik";
import type { Live } from "~/models";

export const LiveStreamContext = createContextId<Live>('live.stream-context');
