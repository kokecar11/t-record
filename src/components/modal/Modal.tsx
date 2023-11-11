import { $, Slot, component$, useOnDocument } from '@builder.io/qwik'
import { 
    type QwikIntrinsicElements,
    type PropFunction
} from '@builder.io/qwik'
import cn from 'classnames'

import { Icon, IconCatalog } from '../icon/icon'
import Button, { ButtonVariant } from '../button/Button'


export enum ModalSize {
    sm = 'sm',
    base = 'base',
    lg = 'lg',
    xl = 'xl',
}

const Sizes: Record<ModalSize, string> = {
    [ModalSize.sm]: 'max-w-md',
    [ModalSize.base]: 'max-w-lg',
    [ModalSize.lg]: 'max-w-xl',
    [ModalSize.xl]: 'max-w-2xl',
}

export type ModalProps = QwikIntrinsicElements['div'] & {
    title?:string;
    content?: string;
    isVisible?: boolean;
    size?: ModalSize.base;
    footer?: string;
    onClose: PropFunction<() => boolean >
}


export default component$( ({title, content, isVisible, size = ModalSize.base, onClose, footer, ...props}:ModalProps) => {    
    const classes = {
        container : cn(
            'fixed flex transform-none transition-transform animate-fade animate-duration-150 w-full pointer-events-none mx-auto h-full h-screen overflow-hidden',
            'inset-0 z-40 bg-back bg-opacity-20 backdrop-blur-sm justify-center items-center',
            {
                'block': isVisible,
                'hidden': !isVisible,
            },
            ),
        content: cn(
            'overflow-hidden',
            'relative flex flex-col w-full pointer-events-auto bg-clip-padding outline-0 rounded-2xl max-h-full bg-primary',
            Sizes[size],
            ),
        header: {
            container: cn('p-5 relative flex justify-between'),
            title: cn('font-bold text-2xl line-clamp-3 text-white items-center'),
            subtitle: cn(),
            closeBtn: cn('absolute'),
        },
        body: cn('relative flex-auto px-6'),
        footer: cn('flex flex-wrap flex-shrink-0 items-center w-full p-6'),
    }
    // const handlerOnClose = $((e:any) => {
    //     if(e.target.id === 'wrapper-modal') onClose();
    // })

    useOnDocument('keydown', $((event)=>{
        const key = event as KeyboardEvent
        if(key.code === 'Escape' && isVisible) onClose()
    }));

    return (
        <div class={classes.container} {...props}>
            <div class={classes.content}>
                <div class={classes.header.container}>
                    <h2 class={classes.header.title}>{title}</h2>
                    {/* <h3 class={classes.header.subtitle}>{subtitle}</h3> */}
                    <Button variant={ButtonVariant.ghost} classNames={classes.header.closeBtn} isOnlyIcon> <Icon name={IconCatalog.feClose} /> </Button>
                </div>
                <div class={classes.body}>
                    {content ? <p>{content}</p>:<Slot name="modal-body"/>}
                </div>
                <div class={classes.footer}>{footer ? <p>{footer}</p>:<Slot name="modal-footer"/>}</div>
            </div>
        </div>
    )
} )