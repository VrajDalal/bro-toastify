import React from 'react';
import type { BroToastify, BroToastifyContainerOptions } from '../../core/types';
export declare const Toaster: {
    ({ position, newestOnTop, dismissible, animation, }: {
        position?: BroToastify['position'];
        newestOnTop?: boolean | undefined;
        dismissible?: boolean | undefined;
        animation?: BroToastifyContainerOptions['animation'];
    }): React.ReactPortal | null;
    displayName: string;
};
