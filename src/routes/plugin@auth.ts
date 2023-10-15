import { serverAuth$ } from "@builder.io/qwik-auth";

import Twitch from "@auth/core/providers/twitch";
import type { Provider } from "@auth/core/providers";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    adapter: PrismaAdapter(prisma),
    secret: env.get("AUTH_SECRET"),
    trustHost: true,
    providers: [
      Twitch({
        clientId: env.get("TWITCH_ID")!,
        clientSecret: env.get("TWITCH_SECRET")!,
      }),
    ] as Provider[],
  }));
