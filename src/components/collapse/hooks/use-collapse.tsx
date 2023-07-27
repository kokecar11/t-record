import { $, useSignal } from "@builder.io/qwik";


export const useCollapse = () => {

    const isOpenCollapse = useSignal(false);

    const showCollapse = $(() => isOpenCollapse.value = !isOpenCollapse.value);
    
    return {
        isOpenCollapse,
        showCollapse
    }
}