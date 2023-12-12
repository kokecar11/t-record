import { component$, useContext } from '@builder.io/qwik'
import { LiveStreamContext } from '~/context'

export const Live = component$(() => {
  const live = useContext(LiveStreamContext)
  return (
    <div class="flex place-items-center space-x-2">
        <span class="font-semibold text-white capitalize">{live.status}</span> 
        <div class={`rounded-full w-3 h-3 ${live.status === 'live' ? 'bg-live animate-pulse':'bg-offline'}`}></div>
    </div>
  )
})