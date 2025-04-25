// import { defineComponent, h, ref, onMounted, onUnmounted, PropType, Teleport } from 'vue';
// import { broToastify as coreToast, on } from '../../core/bro-toastify';
// import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
// import { injectStyles } from '../../dom/style';

// // Composable for using toast
// export function useToast() {
//     return {
//         show: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
//             coreToast.show(message, options),
//         success: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
//             coreToast.success(message, options),
//         error: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
//             coreToast.error(message, options),
//         info: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
//             coreToast.info(message, options),
//         warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
//             coreToast.warning(message, options),
//         dismissible: coreToast.dismissible,
//         clearAll: coreToast.clearAll
//     };
// }

// // Toast item component
// const ToastItem = defineComponent({
//     name: 'ToastItem',
//     props: {
//         toast: {
//             type: Object as PropType<BroToastify>,
//             required: true
//         }
//     },
//     setup(props: any) {
//         const handleDismiss = () => {
//             coreToast.dismissible(props.toast.id);
//         };

//         const handleClick = () => {
//             if (props.toast.onClick) {
//                 props.toast.onClick();
//             }
//         };

//         return () => h(
//             'div',
//             {
//                 class: [
//                     'toast-notification',
//                     `toast-${props.toast.type}`,
//                     props.toast.customClass
//                 ],
//                 role: 'alert',
//                 onClick: handleClick
//             },
//             [
//                 // Title
//                 props.toast.title && h(
//                     'div',
//                     { class: 'toast-title' },
//                     props.toast.title
//                 ),

//                 // Message
//                 h('div', { class: 'toast-message' }, props.toast.message),

//                 // Close button
//                 props.toast.dismissible && h(
//                     'button',
//                     {
//                         class: 'toast-close',
//                         'aria-label': 'Close',
//                         onClick: (e: Event) => {
//                             e.stopPropagation();
//                             handleDismiss();
//                         }
//                     },
//                     '×'
//                 ),
//             ]
//         );
//     }
// });

// // Toast container component
// export const ToastContainer = defineComponent({
//     name: 'ToastContainer',
//     props: {
//         position: {
//             type: String as PropType<BroToastifyToastifyOptions['position']>,
//             default: 'top-right'
//         },
//         newestOnTop: {
//             type: Boolean,
//             default: true
//         }
//     },
//     setup(props: any) {
//         const toasts = ref<BroToastify[]>([]);

//         onMounted(() => {
//             // Inject styles
//             if (typeof window !== 'undefined') {
//                 injectStyles();
//             }

//             // Subscribe to toast events
//             const createUnsubscribe = on('create', (toast: BroToastify) => {
//                 if (toast.position === props.position) {
//                     if (props.newestOnTop) {
//                         toasts.value = [toast, ...toasts.value];
//                     } else {
//                         toasts.value = [...toasts.value, toast];
//                     }
//                 }
//             });

//             const dismissUnsubscribe = on('dismiss', (toast: BroToastify) => {
//                 toasts.value = toasts.value.filter((t: any) => t.id !== toast.id);
//             });

//             // Cleanup
//             onUnmounted(() => {
//                 createUnsubscribe();
//                 dismissUnsubscribe();
//             });
//         });

//         return () => h(
//             Teleport,
//             { to: 'body' },
//             h(
//                 'div',
//                 {
//                     class: [
//                         'toast-container',
//                         `toast-${props.position}`
//                     ]
//                 },
//                 toasts.value.map((toast: any) => h(ToastItem, { key: toast.id, toast }))
//             )
//         );
//     }
// });

// // Export the core toast for direct usage
// export const toast = coreToast;

// // Plugin installation
// export const plugin = {
//     install(app: any) {
//         app.component('ToastContainer', ToastContainer);
//         app.config.globalProperties.$toast = toast;
//     }
// };

// export default plugin;