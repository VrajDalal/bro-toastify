export * from './core/bro-toastify';
export * from './core/types';

// Export framework adapters
import * as ReactAdapter from './adapters/react';
import * as AngularAdapter from './adapters/angular';
import * as VanillaAdapter from './adapters/vanilla';
// import * as VueAdapter from './adapters/vue';
// import * as SvelteAdapter from './adapters/svelte';

// Named exports for each framework
export const React = ReactAdapter;
export const Angular = AngularAdapter;
export const Vanilla = VanillaAdapter;
// export const Vue = VueAdapter;
// export const Svelte = SvelteAdapter;

// Export toast as a named export
export { broToastify } from './core/bro-toastify';

// Also create a default export for convenience
export { ToastContainer } from './adapters/react'; // Adjust the path if necessary
import { broToastify } from './core/bro-toastify';
export default broToastify;