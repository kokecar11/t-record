import { $, component$, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Form, routeAction$, server$, z, zod$ } from '@builder.io/qwik-city';
import type { User } from 'supabase-auth-helpers-qwik';

import { type MarkerType, supabase } from '~/core/supabase/supabase';

import type { MarkerStateI } from '~/marker/interfaces/marker';
import {type ProviderI } from '~/core/interfaces/provider';

import { useModal } from '~/components/modal/hooks/use-modal';
import { useToast } from '~/components/toast/hooks/use-toast';
import { useLiveStream } from '~/live/hooks/use-live-stream';
import { useMenuDropdown } from '~/components/menu-dropdown/hooks/use-menu-dropdown';

import { LiveStreamContext } from '~/live/context/live.context';
import { AuthSessionContext } from '~/auth/context/auth.context';

import Modal from '~/components/modal/Modal';
import Button from '~/components/button/Button';
import { Input } from '~/components/input/Input';
import { Marker } from '~/components/marker/Marker';
import { markerStream } from '~/marker/marker';
import { Icon, IconCatalog } from '~/components/icon/icon';
import { MenuDropdown } from '~/components/menu-dropdown/Menu-dropdown';



export const taskForm = zod$({
  title: z.string({
    required_error: "The title of the marker is required",
  }).nonempty({
    message: "The title of the marker is required",
  }),
  stream_date: z.string().nonempty({
    message:"The date of the stream is required"
  }).transform(str => new Date(str))
});

export const instantMarkerForm = zod$({
  desc_marker: z.string({
    required_error: "La descripción del marcador es requerida.",
    invalid_type_error: "Title start marker must be a string",
  }).nonempty({
    message: "La descripción del marcador es requerida.",
  }),
});

export const useCreateMarker = routeAction$(
  async (dataForm, {cookie}) => {
    const user:User =  cookie.get('_user')!.json()
    const insertData = {
      fk_user: user.id,
      ...dataForm
    }
    const { error } = await supabase.from('task').insert(insertData)
    if(error){
      return {
        success: false,
        msg: 'Task could not be saved'
      }  
    }
    return {
      success: true,
      msg: 'Task successfully saved!'
    };

},  taskForm);

export const useCreateInstantMarker = routeAction$(
  async (dataForm, {cookie}) => {
    const provider:ProviderI = cookie.get('_provider')!.json();
    const user:User =  cookie.get('_user')!.json()
    const responseStream = await markerStream(provider,user, dataForm.desc_marker);
    
    if(responseStream.status === 404){
      return {
        success: false,
        msg: 'Marker could not be created in the stream.'
      };
    }
    return {
      success: true,
      msg: 'Marker successfully created in the stream!'
    };

},  instantMarkerForm);

export const getMarkers = server$(
    async (fkUser) => {
      const { data, error } = await supabase.from('task')
      .select('*')
      .eq('fk_user', fkUser)
      .order('stream_date',{ ascending: true });
      
      if (error){
        return [];
      }else{
        return [ ...data  ] as MarkerType[];
      }
});

export const deleteMarker = server$(
  async (idMarker) => {
    await supabase.from('task')
    .delete()
    .eq('id', idMarker)
});

export const getIndicatorsMarkers = server$(async function() {
  
  const user:User = this.cookie.get('_user')!.json();

  const { data } = await supabase.from('countstatusperuser').select('*').eq('fk_user',user.id);

  const recordingCount = data?.find(marker => marker.status === 'RECORDING')?.statuscount | 0;
  const recordedCount = data?.find(marker => marker.status === 'RECORDED')?.statuscount | 0;
  const unRecordedCount = data?.find(marker => marker.status === 'UNRECORDED')?.statuscount | 0;
  const totalMarkers = recordingCount + recordedCount + unRecordedCount;
  
  const indicators = [
      {title: 'Total', counter: totalMarkers},
      {title: 'Recording', counter: recordingCount},
      {title: 'Unrecorded', counter: unRecordedCount},
      {title: 'Recorded', counter: recordedCount},
  ];
  
  return indicators
});  

export default component$(() => {

    const { isVisibleMenuDropdown, showMenuDropdown } = useMenuDropdown();
    const createMarker = useCreateMarker();

    const { getStatusStream } = useLiveStream();
    const { isVisibleModal ,showModal } = useModal();
    const { setToast, Toasts } = useToast();

    const authSession = useContext(AuthSessionContext);
    const live = useContext(LiveStreamContext);
    
    const markerList = useStore<MarkerStateI>({
        currentPage: 0,
        markers: [],
        isLoading: false,
        indicators: [
          {title: 'Total',counter: 0},
          {title: 'Recording',counter: 0},
          {title: 'Unrecorded',counter: 0},
          {title: 'Recorded',counter: 0}
        ]
    });

    const orderOptions = [
      {name: 'Order by date', icon: IconCatalog.feArrowUp},
      {name: 'Order', icon: IconCatalog.feArrowUp},
      {name: 'Order by date', icon: IconCatalog.feArrowUp},
    ];

    useVisibleTask$(async ({track}) => {  
      const stream = await getStatusStream();
      track(()=> [markerList.isLoading, live.status, live.isLoading])
      markerList.isLoading = false;
      markerList.markers = await getMarkers(authSession.value?.user.id);
      markerList.indicators = await getIndicatorsMarkers();
      live.isLoading = false;
      live.status = stream.status;
    })

    return (
        <>
            <div class="w-full px-10 py-6 h-full">
                {
                  markerList.markers.length > 0 ? (
                  <>
                    <div class="gap-y-4 sm:flex sm:space-x-4">
                      <div class="grid gap-y-4 sm:flex sm:flex-1 sm:space-x-4">
                        {/* <Button class="btn-accent flex items-center justify-center w-full md:w-auto shadow-lg">
                          <Icon name={IconCatalog.feCalendar} class="mr-1" /> Today
                        </Button> */}
                        <Button class="btn-accent flex items-center justify-center w-full md:w-auto shadow-lg" onClick$={showModal}>
                          <Icon name={IconCatalog.fePlus} class="mr-1" /> New task
                        </Button>
                        <Button class="btn-accent flex items-center justify-center w-full md:w-auto shadow-lg" onClick$={async () => {
                          const stream = await getStatusStream()
                          live.status = stream.status;
                            setToast({message:'Live status has been refreshed.'})
                          }}>
                          <Icon class="mr-1" name={IconCatalog.feLoop} /> Refresh Live
                        </Button>
                        
                      </div>
                      {/* <div class="flex-none space-x-4 mt-4 sm:m-0">
                        <Button class="btn-outlined-secondary flex items-center justify-center w-full md:w-auto shadow-lg" onClick$={showMenuDropdown}>
                          <Icon name={IconCatalog.feArrowDown} class="mr-1" /> Order by
                        </Button>

                      </div> */}
                    </div>
                    <MenuDropdown isVisible={isVisibleMenuDropdown.value} onClose={showMenuDropdown} options={orderOptions}/>

                    <div class="grid grid-cols-1 gap-4 mt-4 md:my-6 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">

                      {
                        markerList.markers.map((m) => (
                          <Marker key={m.id} marker={m} onDelete={$(() => {
                            deleteMarker(m.id)
                            live.isLoading = true;
                            setToast({message:'Task has been deleted', variant:'info'})
                          })} live={live}/>
                        ))
                      }

                    </div>
                  </>
                  )
                  :
                  (
                    <div class="flex items-center justify-center">
                      <div class="space-y-4"> 
                        <h1 class="text-3xl font-bold text-white">
                          You don't have any task for your stream yet, create a task.
                        </h1>
                        <Button class="btn-secondary flex items-center justify-center mx-auto" onClick$={showModal}>
                            <Icon name={IconCatalog.fePlus} class="text-xl mr-1" /> Create your first task
                        </Button>
                      </div>
                    </div>
                  )
                }

            </div>
            <Toasts></Toasts>
            <Modal isVisible={isVisibleModal.value} onClose={showModal}>
              <h2 q:slot='modal-title' class="text-secondary dark:text-white font-bold text-2xl flex place-items-center">
                New task
              </h2>
              <div q:slot="modal-content" class={"mx-5"}>
                <Form action={createMarker} 
                onSubmitCompleted$={() => {
                   if (!createMarker.value?.failed){
                     showModal();
                     markerList.isLoading = true
                     setToast({message:createMarker.value?.msg})
                  } 
                }}
                spaReset
                >
                  <Input label='Marker title' name='title' type='text' placeholder='Marker title' value={createMarker.formData?.get('title')} />
                  {createMarker.value?.fieldErrors?.title && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.title}</p>}

                  <Input name='stream_date' label='Stream date' placeholder='Stream date' type='date' value={createMarker.formData?.get('stream_date')}></Input>
                  {createMarker.value?.fieldErrors?.stream_date && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.stream_date}</p>}
                  <div class={"mt-6 flex space-x-4"}>
                    <Button class="btn-outlined-secondary w-full" type='button' onClick$={showModal}>Cancel</Button>
                    <Button class="btn-secondary w-full" type='submit'>Create</Button>
                  </div>
                </Form>
              </div>
            </Modal>
      </>
    )
});

export const head: DocumentHead = {
  title: 'Dashboard | T-Record',
  meta: [
    {
      name: 'description',
      content: 'Dashboard T-Record',
    },
  ],
};