// Mock for react-hot-toast
import React, { ReactNode } from 'react';

type ToastHandler = {
  (message: string): string;
  success: (message: string) => string;
  error: (message: string) => string;
  loading: (message: string) => string;
  custom: (jsx: ReactNode) => string;
  dismiss: (toastId?: string) => void;
  remove: (toastId?: string) => void;
  promise: <T>(promise: Promise<T>, messages: any) => Promise<T>;
}

const toast = jest.fn() as unknown as ToastHandler;
toast.success = jest.fn();
toast.error = jest.fn();
toast.loading = jest.fn();
toast.custom = jest.fn();
toast.dismiss = jest.fn();
toast.remove = jest.fn();
toast.promise = jest.fn();

// Export Toaster component separately
export const Toaster = () => null;

export default toast;
