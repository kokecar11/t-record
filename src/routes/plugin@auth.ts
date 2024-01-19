import { serverAuth$ } from "@builder.io/qwik-auth";

import Twitch from "@auth/core/providers/twitch";
import type { Provider } from "@auth/core/providers";
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { TokenSet } from "@auth/core/types";
import { db } from "~/db";


export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    adapter: PrismaAdapter(db),
    secret: env.get("AUTH_SECRET"),
    trustHost: true,
    cookies: {
      pkceCodeVerifier: {
        name: "next-auth.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        },
      },
    },
    providers: [
      Twitch({
        clientId: env.get("TWITCH_ID")!,
        clientSecret: env.get("TWITCH_SECRET")!,
        authorization: {
          params : {
            scope:'openid user:read:email channel:manage:broadcast user:read:broadcast channel_read'
          }
        },
      }),
    ] as Provider[],
    callbacks : {
      async session({session, user}){
        const [twitch] = await db.account.findMany({
          where: { userId: user.id, provider: "twitch"},
        })

        const plan = await db.plan.findFirst({
          where: { type:'STARTER' }
        })
        
        await db.subscription.upsert({
          where: { userId: user.id },
          update: {},
          create: {            
            planId: plan?.id as string,
            userId: user.id,
            type: 'monthly',
            status: 'active'
          },
        })
        
        if (twitch.expires_in! < Date.now()) {
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
  
            await db.account.update({
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
        session.userId = user.id
        return session
      }
      
    }
  }));


  declare module "@auth/core/types" {
    interface Session {
      error?: "RefreshAccessTokenError"
      userId?: string
    }
  }