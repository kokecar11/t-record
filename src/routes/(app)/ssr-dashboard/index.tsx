import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, server$, z, zod$ } from '@builder.io/qwik-city';

import { supabase } from '~/core/supabase/supabase';
import { useModal } from '~/core/hooks/use-modal';

import MiniDashboard from '~/components/mini-dashboard/Mini-dashboard';
import Button from '~/components/button/Button';
import { FeLoop, FePlus, FeTimeline } from '~/components/icons/icons';
import { Tag } from '~/components/tag/Tag';
import Card from '~/components/card/Card';
import Modal from '~/components/modal/Modal';
import { Input } from '~/components/input/Input';

export const taskForm = zod$({
    start_title: z.string({
      required_error: "El titulo del marcador de inicio es requerido",
      invalid_type_error: "Title start marker must be a string",
    }).nonempty({
      message: "El titulo del marcador de inicio es requerido",
    }),
    end_title: z.string(),
    stream_date:z.string().nonempty({
      message:"La fecha del stream es requerida"
    }).transform(str => new Date(str)),
});

export const useCreateMarker = routeAction$(
    async (dataForm, {cookie}) => {
      const insertData = {
        fk_user:  cookie.get('fk_user')?.value,
        ...dataForm
      }
      await supabase.from('MarkerTest').insert(insertData)
      return {
        success: true,
        msg: 'Marcador guardado con exito!.'
      };

  },  taskForm);


export const useGetMarkers = routeLoader$(
  async ({cookie}) => {
    const baseClient = supabase;
    const fk_user = cookie.get('fk_user')?.value;
    const { data } = await baseClient.from('MarkerTest').select('*').eq('fk_user', fk_user).order('status');
    
    return { data };
});


export const useIndicatorsOfTMarkers = routeLoader$(async () => {
  const { data} = await supabase.from('view_indicators_markers').select('*');

  const recordingCount = data?.find(marker => marker.status === 'RECORDING')?.count_status_marker | 0;
  const recordedCount = data?.find(marker => marker.status === 'RECORDED')?.count_status_marker | 0;
  const unRecordedCount = data?.find(marker => marker.status === 'UNRECORDED')?.count_status_marker | 0;
  const totalMarkers = recordingCount + recordedCount + unRecordedCount;
  
  const indicators = [
      {title: 'Total', counter: totalMarkers},
      {title: 'Recording', counter: recordingCount},
      {title: 'Unrecorded', counter: unRecordedCount},
      {title: 'Recorded', counter: recordedCount},
  ];
  
  return {
    indicators
  };
});

export const getStatusStream = server$( async function(){
    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const urlApiTwitch = 'https://api.twitch.tv/helix/streams';
    const userProviderToken = this.cookie.get('user_provider_token')?.value;
    const twitchUserId = this.cookie.get('t_user')?.value;
    const headers = {
        'Authorization':"Bearer " + userProviderToken,
        'Client-Id': TWITCH_CLIENT_ID
    };
    const resp = await fetch(`${urlApiTwitch}?user_id=${twitchUserId}`, {
        headers
    });
    const {data} = (await resp.json()) as {data: {title:string, type:string}[]};
    if (data.length > 0){
      return data;
    }
  
    return [{
      title:'Stream not live',
      type: 'offline'
    }];
});

export const setMarkerInStream = server$(async function(isStartMarker: boolean = true, markerId:number, markerTitle:string) {
  const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const urlApiTwitch = 'https://api.twitch.tv/helix/streams/markers';
 
  const userProviderToken = this.cookie.get('user_provider_token')?.value;
  const twitchUserId = this.cookie.get('t_user')?.value;
  const fkUser = this.cookie.get('fk_user')?.value;
 
  const headers = {
      'Authorization':"Bearer " + userProviderToken,
      'Client-Id': TWITCH_CLIENT_ID
  };

  const respStream = await fetch(`${urlApiTwitch}?user_id=${twitchUserId}&description=${markerTitle}`, {
      method:'POST',
      headers
  });

  const dataStream = await respStream.json();
  // console.log(dataStream)
  if (true){
    if(isStartMarker){
      const { data } = await supabase.from('MarkerTest')
      .update({ status: 'RECORDING' })
      .eq('fk_user',fkUser)
      .eq('id', markerId).select()
      console.log(data)
    }else{
      const { data } = await supabase.from('MarkerTest')
      .update({ status: 'RECORDED' })
      .eq('fk_user',fkUser)
      .eq('id', markerId).select()
      console.log(data)
    }
  }

  return {dataStream}
})



const STATUS_MARKER = Object.freeze({
    RECORDED: 'success',
    RECORDING:'warning',
    UNRECORDED:'danger'
}) 

export default component$(() => {
  const indicators = useIndicatorsOfTMarkers();
  const createMarker = useCreateMarker();
  const tMarkers = useGetMarkers();

  
  const statusOfStreamStore = useStore({
    type: 'live',
    title: 'Stream not live'
  })

  const {isVisibleModal, showModal } = useModal();
  
  useVisibleTask$(async ({track})=>{
    track(()=> [statusOfStreamStore.type, statusOfStreamStore.title, tMarkers.value])
    console.log(tMarkers.value.data)
  });
  return (
    <div class={"flex"}>
        <div class="w-4/5 px-8 py-4 h-screen">
            {
                tMarkers.value.data?.length > 0 ?
                (
                    <div class={"mx-2 col-span-4 grid gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-4"}>
                      {
                       tMarkers.value.data?.map((m) => (
                            <Card key={m.id} streamDate={m.stream_date}>
                              <div q:slot='card-tag' class="flex-1">
                                <Tag text={m.status} size='xs' variant={STATUS_MARKER[m.status]} />
                              </div>
                              <div q:slot='card-content'>
                                <div class="mt-4">
                                  <h4 class="flex text-sm font-medium text-slate-900 dark:text-white"><FeTimeline class="text-xl mr-1 text-green-500" />Initial marker:</h4>
                                  <p class="text-slate-900 dark:text-white capitalize ml-1 line-clamp-3">{m.start_title}</p>
                                </div>
                  
                                <div class="mt-4">
                                  <h4 class="flex text-sm font-medium text-slate-900 dark:text-white"><FeTimeline class="text-xl mr-1 text-red-500" />Final marker:</h4>
                                  <p class="text-slate-900 dark:text-white capitalize ml-1 line-clamp-3">{m.end_title ? m.end_title : `End -> ${m.start_title}`}</p>
                                </div>
                              </div>
                              <div q:slot='card-actions'>
                                <Button class="btn btn-violet text-sm" 
                                  onClick$={async () => { 
                                    const t_m = await setMarkerInStream(true,m.id ,m.start_title)
                                    if (t_m.dataStream.error){
                                      statusOfStreamStore.type = 'offline'
                                      statusOfStreamStore.title= 'Stream not live'
                                    }
                                  }}
                                  disabled={(m.status === 'RECORDING' || m.status === 'RECORDED' || statusOfStreamStore.type === 'offline' ) ? true : false}
                                  >
                                    Start
                                </Button>
                                <Button class="btn btn-slate text-sm" 
                                // onClick$={async () => {await setMarkerInStream(false, m.id, m.end_title)}}
                                disabled={(m.status === 'RECORDED'  || statusOfStreamStore.type === 'offline') ? true : false}
                                >Finish</Button>
                              </div>
                            </Card>
                        ))
                      } 
                    </div>
                  ):
                  (
                    <div class="grid place-items-center gap-y-2">
                        <h1 class="text-3xl font-bold text-violet-900 dark:text-white">Aún no tienes marcadores para tu Stream, crea un marcador.</h1>
                        <Button class="btn-violet flex items-center justify-center" onClick$={showModal}>
                            <FePlus class="text-xl mr-1" /> Create your first maker
                        </Button>
                    </div>
                    )
            }
        </div>
        <MiniDashboard>
            <div q:slot='dashboard-actions-top'>
              <Button class="btn-violet flex items-center justify-center mx-auto w-full" onClick$={showModal}>
                <FePlus class="text-xl mr-1" /> New marker
              </Button>

              <div class="flex items-center mt-4 mb-2">
                <hr class="flex-grow border-violet-900"></hr>
                <h3 class="mx-2 font-bold text-violet-900 dark:text-white">Status Stream</h3>
                <hr class="flex-grow border-violet-900"></hr>
              </div>
              
              <div class="grid place-items-center space-y-1">
                { statusOfStreamStore.title &&(<span class="text-violet-900 dark:text-white text-sm font-semibold">{statusOfStreamStore.title}</span>)}
                {statusOfStreamStore.type && statusOfStreamStore.type === 'live' ? 
                  (<Tag text='Live' variant='danger'/>) : 
                  (<Tag text='Offline' variant='secondary'/>) 
                }
                <Button class="btn-violet btn-xs flex items-center justify-center mx-auto" onClick$={async () => {
                  const stream = await getStatusStream()
                  statusOfStreamStore.type = stream[0].type
                  statusOfStreamStore.title = stream[0].title
                  }}>
                  <FeLoop class="text-xl" />
                </Button>
              </div>
              
            </div>
            <div q:slot='dashboard-indicators'>
              <div  class={"grid grid-cols-2 gap-4 mb-4"}>
                {indicators.value.indicators?.map((indicator) => (
                  <div key={indicator.title} class="bg-slate-500 p-4 bg-opacity-30 rounded-lg">
                        <h2 class="text-xs text-violet-900 dark:text-white font-medium mb-2">{indicator.title}</h2>
                        <p class="text-lg font-bold text-violet-800 dark:text-white">
                            <span class={"border-l-2 dark:border-violet-700 border-slate-900 mr-2"}></span> {indicator.counter}
                        </p>
                  </div>
                ))} 
              </div>
            </div>
          </MiniDashboard>
          <Modal isVisible={isVisibleModal.value} onClose={showModal}>
            <h2 q:slot='modal-title' class="text-violet-900 dark:text-white font-bold text-2xl flex place-items-center">
              <FeTimeline class="mr-2"/> New markers
            </h2>
            <div q:slot="modal-content" class={"mx-5"}>
              <Form action={createMarker} onSubmitCompleted$={() => {
                if (!createMarker.value?.failed) showModal();
              }}>
                {/* <Input name='fk_user' bind:value={fk_user} type='hidden' value={fk_user.value} /> */}
                <Input label='Starting marker title' name='start_title' type='text' placeholder='Starting marker title' value={createMarker.formData?.get('start_title')} />
                {createMarker.value?.fieldErrors?.start_title && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.start_title}</p>}
                
                <Input label='Ending marker title' name='end_title' type='text' placeholder='Ending marker title' value={createMarker.formData?.get('end_title')} />
                {createMarker.value?.fieldErrors?.end_title && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.end_title}</p>}
                <Input name='stream_date' label='Stream date' placeholder='Stream date' type='datetime-local' value={createMarker.formData?.get('stream_date')}></Input>
                {createMarker.value?.fieldErrors?.stream_date && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.stream_date}</p>}
                <div class={"mt-4"}>
                  <button class={"bg-violet-900 p-3 rounded-lg text-white w-full"} type='submit'>Save</button>
                </div>
              </Form>
            </div>
          </Modal>
    </div>
  );
});