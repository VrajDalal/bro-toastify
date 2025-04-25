// Export core functionality
// export * from './core/types';
// export * from './core/bro-toastify'; // Export toast to match test.html

// // Export framework adapters
// import * as ReactAdapter from './adapters/react';
// import * as AngularAdapter from './adapters/angular';
// import * as SvelteAdapter from './adapters/svelte';
// import * as VanillaAdapter from './adapters/vanilla';

// export const React = ReactAdapter;
// export const Angular = AngularAdapter;
// export const Svelte = SvelteAdapter;
// export const Vanilla = VanillaAdapter;

// Optionally, keep broToastify if needed elsewhere
// export { broToastify } from './core/bro-toastify';


// Export core functionality
export * from './core/types';

// Export framework adapters
import * as ReactAdapter from './adapters/react';
import * as AngularAdapter from './adapters/angular';
// import * as SvelteAdapter from './adapters/svelte';
import * as VanillaAdapter from './adapters/vanilla/index';

export const React = ReactAdapter;
export const Angular = AngularAdapter;
// export const Svelte = SvelteAdapter;

// Export Vanilla adapter directly
export const Vanilla = {
    ...VanillaAdapter,
    injectStyles: VanillaAdapter.injectStyles, // Ensure injectStyles is included``
};
// Optionally, keep broToastify if needed elsewhere
export { broToastify } from './core/bro-toastify';