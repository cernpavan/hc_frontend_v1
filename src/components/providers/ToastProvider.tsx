'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#252033',
          color: '#f3f0f7',
          border: '1px solid #2d283d',
          borderRadius: '12px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#4ade80',
            secondary: '#252033',
          },
        },
        error: {
          iconTheme: {
            primary: '#f87171',
            secondary: '#252033',
          },
        },
      }}
    />
  );
}
