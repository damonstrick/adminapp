'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast from './Toast';

interface ToastContextType {
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    setToast({ message, actionLabel, onAction });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleAction = () => {
    if (toast?.onAction) {
      toast.onAction();
    }
    closeToast();
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          isOpen={!!toast}
          onClose={closeToast}
          actionLabel={toast.actionLabel}
          onAction={toast.actionLabel ? handleAction : undefined}
        />
      )}
    </ToastContext.Provider>
  );
}

