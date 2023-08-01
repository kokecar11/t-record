import { $, useSignal } from "@builder.io/qwik";


export const useMenuDropdown = () => {

    const isVisibleMenuDropdown = useSignal(false);

    const showMenuDropdown = $(() => isVisibleMenuDropdown.value = !isVisibleMenuDropdown.value);
    
    return {
        isVisibleMenuDropdown,
        showMenuDropdown
    }
}