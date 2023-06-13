import { $, component$, useStore } from "@builder.io/qwik";
import { Toast, type ToastProps } from "../Toast";


interface Toast {
    list: ToastProps[];
}

export const useToast = () => {

    const toastStore = useStore<Toast>({
        list:[]
    });

    const setToast = $((toast:ToastProps) => {
        toastStore.list = [...toastStore.list, toast];
        
        setTimeout(() => {
            toastStore.list = toastStore.list.slice(1);
        }, 3000)
    });
    

    const Toasts = component$(() =>  
        <>
            {
                toastStore.list.map((t,index) => (
                    <Toast key={index} variant={t.variant} message={t.message} />
                ))
            }
        </>
    )

    return {
        setToast,
        Toasts
    }
}