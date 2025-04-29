import React from "react";
import type { BroToastifyToastifyOptions } from "../../core/types";
export declare const Toaster: {
    ({ position, newestOnTop, dismissible, }: {
        position?: BroToastifyToastifyOptions["position"];
        newestOnTop?: boolean | undefined;
        dismissible?: boolean | undefined;
    }): React.ReactPortal | null;
    displayName: string;
};
