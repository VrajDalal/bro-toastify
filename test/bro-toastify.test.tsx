import React from 'react';
import { render, screen, act } from '@testing-library/react';
import toast, { Toaster } from '../src'; // adjust if your entry file is different

describe('BroToastify', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('renders a success toast', () => {
        render(<Toaster position="top-right" dismissible />);
        act(() => {
            toast.success('Success toast!');
        });

        expect(screen.getByText('Success toast!')).toBeInTheDocument();
    });

    it('dismisses toast after duration', () => {
        render(<Toaster />);
        act(() => {
            toast.info('Auto dismiss');
            jest.advanceTimersByTime(4000);
        });

        expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
    });

    it('renders a loading toast then success via promises()', async () => {
        render(<Toaster />);
        const promise = new Promise((resolve) => setTimeout(() => resolve(true), 1000));

        act(() => {
            toast.promises(
                promise,
                {
                    loading: 'Loading...',
                    success: 'Loaded!',
                    error: 'Error!',
                },
                { duration: 3000 }
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(await screen.findByText('Loaded!')).toBeInTheDocument();
    });
});
