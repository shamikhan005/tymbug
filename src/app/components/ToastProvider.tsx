'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#333',
          color: '#fff',
          fontFamily: 'monospace',
        },
        success: {
          style: {
            background: '#1E293B',
            border: '1px solid #10B981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFAEE',
          },
        },
        error: {
          style: {
            background: '#1E293B',
            border: '1px solid #EF4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFAEE',
          },
        },
      }}
    />
  );
}
