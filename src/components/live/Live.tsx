import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { LiveStreamContext } from "~/live/context/live.context";
import { useLiveStream } from "~/live/hooks/use-live-stream";

export const Live = component$(() => {
  
  const live = useContext(LiveStreamContext);
  const { getStatusStream } = useLiveStream();

  useVisibleTask$ (async ({track}) => {
    track( () => [live.status])
    const stream  = await getStatusStream();
    live.status = stream.status;
  })
  return (
    <div class="flex place-items-center space-x-2">
        <span class="text-accent font-semibold dark:text-white capitalize">{live.status}</span> 
        <div class={`rounded-full w-3 h-3 ${live.status === 'live' ? 'bg-live animate-pulse':'bg-offline'}`}></div>
    </div>
  );
});