import {type QwikIntrinsicElements, component$, useStyles$} from "@builder.io/qwik";
import styleInput from './Input.css?inline'

export type InputProps = QwikIntrinsicElements['input'] & {
    label?:string;
};

export const Input = component$( ({label, ...props}: InputProps) => {
    useStyles$(styleInput)
    return(
    <div class="mt-4 mb-2">
        <label class="label-input">{label}</label>
        <input 
            {...props}
            class="input" />
    </div>
    );
})