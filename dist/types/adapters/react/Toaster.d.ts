import React from 'react';
import type { BroToastifyToastifyOptions } from '../../core/types';
export declare const Toaster: {
    ({ position, newestOnTop, dismissible, }: {
        position?: BroToastifyToastifyOptions['position'];
        newestOnTop?: any;
        dismissible?: any;
    }): React.ReactPortal | null;
    displayName: string;
};
