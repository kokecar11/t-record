import { $, Slot, component$, useOnDocument } from '@builder.io/qwik'
import { 
    type QwikIntrinsicElements,
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
    isVisible?: any;
    size?: ModalSize.base;
    footer?: string;
    btnClose?: boolean
}


export default component$( ({title, content, isVisible, size = ModalSize.base, btnClose = true, footer, ...props}:ModalProps) => {    
    const classes = {
        container : cn(
            'fixed flex transform-none transition-transform animate-fade animate-duration-150 w-full pointer-events-none mx-auto h-full h-screen overflow-hidden',
            'inset-0 z-40 bg-white bg-opacity-10 backdrop-blur-sm justify-center items-center',
            {
                'block': isVisible.value,
                'hidden': !isVisible.value,
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
        footer: cn('flex flex-wrap flex-shrink-0 items-center w-full p-4'),
    }
    // const handlerOnClose = $((e:any) => {
    //     if(e.target.id === 'wrapper-modal') onClose();
    // })

    const handleCloseModal = $(() => isVisible.value = !isVisible);
    useOnDocument('keydown', $((event)=>{
        const key = event as KeyboardEvent
        if(key.code === 'Escape' && isVisible.value) {
            handleCloseModal()
        }
    }));


    return (
        <div class={classes.container} {...props}>
            <div class={classes.content}>
                <div class={classes.header.container}>
                    <h2 class={classes.header.title}>{title}</h2>
                    {
                        btnClose && <Button variant={ButtonVariant.ghost} classNames={classes.header.closeBtn} onClick$={handleCloseModal} isOnlyIcon> <Icon name={IconCatalog.feClose} class='text-xl' /> </Button>
                    }
                </div>
                <div class={classes.body}>
                    {content ? <p class='text-white'>{content}</p>:<Slot name="modal-body"/>}
                </div>
                <div class={classes.footer}>{footer ? <p>{footer}</p>:<Slot name="modal-footer"/>}</div>
            </div>
        </div>
    )
} )