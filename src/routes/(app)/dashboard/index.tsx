import { $, component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Form, routeAction$, z, zod$} from '@builder.io/qwik-city';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';
import { type User } from 'supabase-auth-helpers-qwik';

import { supabase } from '~/supabase/supabase-browser';

import { useLiveStream } from '~/hooks';
import { UserSessionContext, TwitchProviderContext, LiveStreamContext } from '~/context';
import { deleteMarker, getMarkers, markerInStream, setSubscriptionByUser } from '~/services';
import { cookieProvider, cookieUserSession } from '~/utilities';

import type { MarkerState, TwitchProvider, UserSession } from '~/models';

import { useModal } from '~/components/modal/hooks/use-modal';
import { useToast } from '~/components/toast/hooks/use-toast';
import { useMenuDropdown } from '~/components/menu-dropdown/hooks/use-menu-dropdown';
import Modal from '~/components/modal/Modal';
import Button from '~/components/button/Button';
import { Input } from '~/components/input/Input';
import { Marker } from '~/components/marker/Marker';
import { Icon, IconCatalog } from '~/components/icon/icon';
import { Loader } from '~/components/loader/Loader';
import { MenuDropdown, type MenuDropdownOptions } from '~/components/menu-dropdown/Menu-dropdown';


export const onRequest: RequestHandler = async (request) => {
  const providerCookie = request.cookie.get('sb-access-token');
  if(!providerCookie){
    throw request.redirect(302, '/logout')
  }
};

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
    const user:UserSession =  cookie.get(cookieUserSession)!.json()
    const insertData = {
      fk_user: user.userId,
      ...dataForm
    }
    const { error } = await supabase.from('markers').insert(insertData)
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
    const provider: TwitchProvider = cookie.get(cookieProvider)!.json();
    const user:User =  cookie.get(cookieUserSession)!.json()
    const responseStream = await markerInStream(provider, user, dataForm.desc_marker);
    
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

export type OrderByMarker = 'stream_date'| 'created_at' | 'status';
export type OrderMarkerByStatus = 'RECORDING'| 'RECORDED' | 'UNRECORDED';
interface FiltersMarkerState {
  byStatus: OrderMarkerByStatus[]
}
export default component$(() => {

    const { isVisibleMenuDropdown, showMenuDropdown } = useMenuDropdown();
    const createMarker = useCreateMarker();

    const { getStatusStream } = useLiveStream();
    const { isVisibleModal ,showModal } = useModal();
    const { setToast, Toasts } = useToast();

    const userSession = useContext(UserSessionContext);
    const twitchProvider = useContext(TwitchProviderContext);
    const live = useContext(LiveStreamContext);
    
    const markerList = useStore<MarkerState>({
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
    const filterMarkerList = useStore<FiltersMarkerState>({
      byStatus: ['RECORDED', 'RECORDING', 'UNRECORDED']
    })
    const orderBySignal = useSignal<OrderByMarker>('stream_date');
    const orderByStatusSignal = useSignal<number>(0);

    const orderByStatusAction = $((status:OrderMarkerByStatus[], ord: number) =>{
      filterMarkerList.byStatus = []
      filterMarkerList.byStatus.push(...status)
      orderByStatusSignal.value = ord
    })

    const orderByStatusOptions: MenuDropdownOptions[] = [
      {name: 'All status', action:$(() => orderByStatusAction(['UNRECORDED', 'RECORDED', 'UNRECORDED'], 0))},
      {name: 'Unrecorded', action:$(() => orderByStatusAction(['UNRECORDED'], 1))},
      {name: 'Recorded', action:$(() => orderByStatusAction(['RECORDED'], 2))},
      {name: 'Recording', action:$(() => orderByStatusAction(['RECORDING'], 3))},
    ]

    useVisibleTask$(async ({track}) => { 
      markerList.isLoading = true
      const stream = await getStatusStream()
      markerList.markers = await getMarkers(userSession.userId, orderBySignal.value, filterMarkerList)
      live.status = stream.status
      live.isLoading = false
      track(()=> [
        markerList.markers,
        markerList.isLoading,
        live.status,
        live.isLoading,
        orderBySignal.value, 
        orderByStatusSignal.value,
        twitchProvider.providerRefreshToken,
        twitchProvider.providerToken,
        filterMarkerList.byStatus])
      setTimeout(() => markerList.isLoading = false, 300)
      markerList.isLoading = false
      await setSubscriptionByUser(userSession.userId);
    });

    return (
        <>
        {markerList.isLoading && <Loader />}
            <div class="w-full container mx-auto px-4 py-6 h-full">
              <div class="gap-y-4 sm:flex sm:space-x-4">
                <div class="grid gap-y-4 sm:flex sm:flex-1 sm:space-x-4">
                  <Button class="btn-primary flex items-center justify-center w-full md:w-auto shadow-lg" onClick$={showModal}>
                    <Icon name={IconCatalog.fePlus} class="mr-1" /> New task
                  </Button>
                  <div class="relative">
                    <Button class="btn-primary flex relative items-center justify-center w-full md:w-40 shadow-lg" onClick$={showMenuDropdown}>
                      <Icon name={IconCatalog.feEqualizer} class="mr-1" /> {orderByStatusOptions[orderByStatusSignal.value].name}
                    </Button>
                    <MenuDropdown isVisible={isVisibleMenuDropdown.value} onClose={showMenuDropdown} options={orderByStatusOptions}/>
                  </div>
                  
                </div>
                <div class="grid grid-cols-1 justify-center items-center space-x-4 mt-4 sm:m-0">
                  <Button class="btn-primary flex items-center justify-center w-full md:w-auto shadow-lg" onClick$={async () => {
                    const stream = await getStatusStream();
                    live.status = stream.status;
                    setToast({message:'Live status has been refreshed.'})
                  }}>
                    <Icon class="mr-1" name={IconCatalog.feLoop} /> Refresh Live
                  </Button>
                  {/* <span class="text-white flex">40/40 Markers</span> */}
                </div>
              </div>
              
                {
                  markerList.markers.length > 0 ? (
                  <>
                    <div class="grid grid-cols-1 gap-4 mt-4 md:my-6 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                      
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
                    <div class="flex items-center justify-center mt-4">
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