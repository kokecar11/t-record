import { type PropFunction,type QwikIntrinsicElements, $, Slot, component$, useStyles$, useOnDocument } from '@builder.io/qwik';
import styles from "./Modal.css?inline";
import { FeClose } from '../icons/icons';

export type ModalProps = QwikIntrinsicElements['div'] & {
    title?:string;
    content?: string;
    isVisible?: boolean;
    onClose: PropFunction<() => boolean >
}

export default component$( ({title, content, isVisible, onClose, ...props}:ModalProps) => {
    useStyles$(styles);
    
    const handlerOnClose = $((e:any) => {
        if(e.target.id === 'wrapper-modal') onClose();
    })

    useOnDocument('keydown', $((event)=>{
        const key = event as KeyboardEvent
        if(key.code === 'Escape' && isVisible) onClose()
    }));

    return (
        <div class={`fixed flex modal ${isVisible ? 'block': 'hidden'}`} onClick$={handlerOnClose} id='wrapper-modal' {...props}>
             <div class={"w-[600px]"}>
                <div class={"bg-white dark:bg-slate-900 p-6 rounded-lg relative"}>
                    <button class={"absolute right-0 origin-top-right mb-10 mr-5 btn-secondary text-violet-900 dark:text-white font-bold text-xl"} onClick$={onClose}> <FeClose/> </button>
                    {title ? <h1 class={"text-xl text-violet-900 dark:text-white font-bold"}>{title}</h1>:<Slot name="modal-title"/>}
                    {content ? <p>{content}</p>:<Slot name="modal-content"/>}
                </div>
            </div>
        </div>
    );
} )