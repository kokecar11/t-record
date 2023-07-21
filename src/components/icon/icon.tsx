import { type QwikIntrinsicElements } from "@builder.io/qwik";


export enum IconCatalog {
    feMagic = 'm3 5l2-2l16 16l-2 2L3 5Zm10 0l1-2l1 2l2 1l-2 1l-1 2l-1-2l-2-1l2-1ZM5 15l1-2l1 2l2 1l-2 1l-1 2l-1-2l-2-1l2-1ZM4 9l1 1l-1 1l-1-1l1-1Zm14 1l1 1l-1 1l-1-1l1-1Z',
    feTrash = 'M4 5h3V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1h3a1 1 0 0 1 0 2h-1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4a1 1 0 1 1 0-2Zm3 2v13h10V7H7Zm2-2h6V4H9v1Zm0 4h2v9H9V9Zm4 0h2v9h-2V9Z',
    feLogout = 'M3 5c0-1.1.9-2 2-2h8v2H5v14h8v2H5c-1.1 0-2-.9-2-2V5Zm14.176 6L14.64 8.464l1.414-1.414l4.95 4.95l-4.95 4.95l-1.414-1.414L17.176 13H10.59v-2h6.586Z',
    feInfo = 'M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16Zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm-1-11v6h2v-6h-2Zm0-4h2v2h-2V7Z',
    feWarning = 'M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16Zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm-1-6h2v2h-2v-2Zm0-10h2v8h-2V6Z',
    feCheck = 'm6 10l-2 2l6 6L20 8l-2-2l-8 8z',
    feLoop = 'M6.876 15.124A6.002 6.002 0 0 0 17.658 14h2.09a8.003 8.003 0 0 1-14.316 2.568L3 19v-6h6l-2.124 2.124Zm10.249-6.249A6.004 6.004 0 0 0 6.34 10H4.25a8.005 8.005 0 0 1 14.32-2.57L21 5v6h-6l2.125-2.125Z',
    feClose = 'M10.657 12.071L5 6.414L6.414 5l5.657 5.657L17.728 5l1.414 1.414l-5.657 5.657l5.657 5.657l-1.414 1.414l-5.657-5.657l-5.657 5.657L5 17.728z',
    fePlus = 'M13 13v7a1 1 0 0 1-2 0v-7H4a1 1 0 0 1 0-2h7V4a1 1 0 0 1 2 0v7h7a1 1 0 0 1 0 2h-7Z',
    feCalendar = 'M8 4h8V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V2h2v2ZM5 8v12h14V8H5Zm2 3h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm0 4h2v2h-2v-2Zm-4 0h2v2h-2v-2Zm-4 0h2v2H7v-2Z',
    // fePlus = '',
}
type IconProps = QwikIntrinsicElements['div'] & {
    name: IconCatalog
}
export function Icon({name ,...props}:IconProps, key: string) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props} key={key}><g id="feMagic0" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1"><g id="feMagic1" fill="currentColor"><path id="feMagic2" d={name}></path></g></g></svg>
    )
}