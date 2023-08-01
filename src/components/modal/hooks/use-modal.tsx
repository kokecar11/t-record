import { $, useSignal } from "@builder.io/qwik";


export const useModal = () => {

    const isVisibleModal = useSignal(false);

    const showModal = $(() => isVisibleModal.value = !isVisibleModal.value);
    
    return {
        isVisibleModal,
        showModal
    }
}