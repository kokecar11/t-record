import { useSignal } from "@builder.io/qwik"
import { server$ } from "@builder.io/qwik-city"
import { PrismaClient } from "@prisma/client"

import type { StatusLive } from "~/models"
import { useAuthSession } from "~/routes/plugin@auth"


export const useLiveStream = () => {
    const userProviderToken = useSignal('')
    const session = useAuthSession()

    const getStatusStream = server$( async function(){
        const TWITCH_CLIENT_ID = this.env.get('TWITCH_ID') as string
        const urlApiTwitch = new URL('https://api.twitch.tv/helix/streams')
        const prisma = new PrismaClient()
        const user = await prisma.user.findFirst({
          where:{
            email: session.value?.user?.email
          },
          include:{
            accounts:true
          }
        })
        const account = user?.accounts[0]
        const headers = {
            'Accept': 'application/json',
            'Authorization':"Bearer " + account?.access_token,
            'Client-Id': TWITCH_CLIENT_ID 
        }
        
        urlApiTwitch.searchParams.set('user_id', account?.providerAccountId as string)
        const resp = await fetch(urlApiTwitch, {
          headers,
          method:'GET',
        })
      
        
        const { data } = (await resp.json()) as {data: {type:StatusLive}[]}
        if (data === undefined || data.length === 0){
          const status: StatusLive = 'offline';
          return { status };
        }

        const live = {
          status: data[0].type
        }
        return live
      })
        

    return {
        getStatusStream,
        userProviderToken
    }
}