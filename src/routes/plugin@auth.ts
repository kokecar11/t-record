import { serverAuth$ } from "@builder.io/qwik-auth";

import Twitch from "@auth/core/providers/twitch";
import type { Provider } from "@auth/core/providers";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { TokenSet } from "@auth/core/types";

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
    callbacks : {
      async session({session, user}){
        const [twitch] = await prisma.account.findMany({
          where: { userId: user.id, provider: "twitch"},
        })

        if (twitch.expires_in! * 1000 < Date.now()) {
          try {
            const response = await fetch("https://id.twitch.tv/oauth2/token", {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: twitch.refresh_token as string,
                client_id: env.get("TWITCH_ID") as string,
                client_secret: env.get("TWITCH_SECRET") as string, 
              }),
              method: "POST",
            })
  
            const tokens: TokenSet = await response.json()
  
            if (!response.ok) throw tokens
  
            await prisma.account.update({
              data: {
                access_token: tokens.access_token,
                expires_in: Math.floor(Date.now() / 1000 + tokens.expires_in!),
                refresh_token: tokens.refresh_token ?? twitch.refresh_token,
              },
              where: {
                provider_providerAccountId: {
                  provider: "twitch",
                  providerAccountId: twitch.providerAccountId,
                },
              },
            })
          } catch (error) {
            session.error = "RefreshAccessTokenError"
          }
        }
        return session
      }
    }
  }));


  declare module "@auth/core/types" {
    interface Session {
      error?: "RefreshAccessTokenError"
    }
  }