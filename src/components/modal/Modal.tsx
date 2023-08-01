import { type QwikIntrinsicElements, type PropFunction, $, Slot, component$, useStyles$, useOnDocument } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Icon, IconCatalog } from '../icon/icon';
import styles from "./Modal.css?inline";

export type ModalProps = QwikIntrinsicElements['div'] & {
    title?:string;
    content?: string;
    isVisible?: boolean;
    onClose: PropFunction<() => boolean >
}

export default component$( ({title, content, isVisible, onClose, ...props}:ModalProps) => {
    useStyles$(styles);
    
    // const handlerOnClose = $((e:any) => {
    //     if(e.target.id === 'wrapper-modal') onClose();
    // })

    useOnDocument('keydown', $((event)=>{
        const key = event as KeyboardEvent
        if(key.code === 'Escape' && isVisible) onClose()
    }));

    return (
        <div class={`fixed flex modal ${isVisible ? 'block': 'hidden'} animate-fade animate-duration-150` } id='wrapper-modal' {...props}>
             <div class={"w-[600px]"}>
                <div class={"bg-accent p-6 rounded-lg relative"}>
                    <Link class={"absolute right-0 origin-top-right mb-10 mr-5 text-secondary dark:text-white font-bold text-xl cursor-pointer"} onClick$={onClose}> <Icon name={IconCatalog.feClose} /> </Link>
                    {title ? <h1 class={"text-xl text-secondary dark:text-white font-bold"}>{title}</h1>:<Slot name="modal-title"/>}
                    {content ? <p>{content}</p>:<Slot name="modal-content"/>}
                </div>
            </div>
        </div>
    );
} )