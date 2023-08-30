import { component$, useContext, useTask$ } from "@builder.io/qwik"
import { LiveStreamContext } from "~/context"
import { useLiveStream } from "~/hooks"


export const Live = component$(() => {
  
  const live = useContext(LiveStreamContext)
  const { getStatusStream } = useLiveStream()

  useTask$ (async ({track}) => {
    const stream  = await getStatusStream()
    track(() => live.status)
    live.status = stream.status
  })

  return (
    <div class="flex place-items-center space-x-2">
        <span class="font-semibold text-white capitalize">{live.status}</span> 
        <div class={`rounded-full w-3 h-3 ${live.status === 'live' ? 'bg-live animate-pulse':'bg-offline'}`}></div>
    </div>
  )
})