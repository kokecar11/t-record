import { createContextId } from "@builder.io/qwik";
import type { UserSession } from "~/models";

export const UserSessionContext = createContextId<UserSession>('user-session-context');