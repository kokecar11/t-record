import { component$, useContext, useTask$ } from '@builder.io/qwik'
import { LiveStreamContext } from '~/context'
import { useLiveStream } from '~/hooks'

export const Live = component$(() => {
  const { getStatusStream } = useLiveStream()

  const live = useContext(LiveStreamContext)
  useTask$(async ({track}) => {
    track(() => [live])
    const stream = await getStatusStream()
    live.status = stream.status
    live.isLoading = false
    live.vod = stream?.vod
    live.gameId = stream?.gameId
  })
  return (
    <div class="flex place-items-center space-x-2">
        <span class="font-semibold text-white capitalize">{live.status}</span> 
        <div class={`rounded-full w-3 h-3 ${live.status === 'live' ? 'bg-live animate-pulse':'bg-offline'}`}></div>
    </div>
  )
})