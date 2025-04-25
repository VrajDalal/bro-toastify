export * from './core/bro-toastify';
export * from './core/types';

// Export framework adapters
import * as ReactAdapter from './adapters/react';
// import * as VueAdapter from './adapters/vue';
import * as AngularAdapter from './adapters/angular';
import * as SvelteAdapter from './adapters/svelte';
import * as VanillaAdapter from './adapters/vanilla';

// Named exports for each framework
export const React = ReactAdapter;
// export const Vue = VueAdapter;
export const Angular = AngularAdapter;
export const Svelte = SvelteAdapter;
export const Vanilla = VanillaAdapter;

// Export toast as a named export
export { broToastify } from './core/bro-toastify';

// Also create a default export for convenience
import { broToastify } from './core/bro-toastify';
export default broToastify;


// Export core functionality
// export * from './core/types';

// // Export framework adapters
// import * as ReactAdapter from './adapters/react';
// import * as AngularAdapter from './adapters/angular';
// // import * as SvelteAdapter from './adapters/svelte';
// import * as VanillaAdapter from './adapters/vanilla/index';

// export const React = ReactAdapter;
// export const Angular = AngularAdapter;
// // export const Svelte = SvelteAdapter;

// // Export Vanilla adapter directly
// export const Vanilla = {
//     ...VanillaAdapter,
//     injectStyles: VanillaAdapter.injectStyles, // Ensure injectStyles is included``
// };
// // Optionally, keep broToastify if needed elsewhere
// export { broToastify } from './core/bro-toastify';