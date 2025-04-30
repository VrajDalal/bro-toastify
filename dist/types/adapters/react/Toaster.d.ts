import React from 'react';
import type { BroToastifyToastifyOptions, BroToastifyContainerOptions } from '../../core/types';
export declare const Toaster: {
    ({ position, newestOnTop, dismissible, animation, }: {
        position?: BroToastifyToastifyOptions['position'];
        newestOnTop?: any;
        dismissible?: any;
        animation?: BroToastifyContainerOptions['animation'];
    }): React.ReactPortal | null;
    displayName: string;
};
