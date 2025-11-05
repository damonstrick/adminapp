'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  isOpen, 
  onClose, 
  actionLabel, 
  onAction,
  duration = 5000 
}: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#f7f8f8] box-border flex gap-2 items-center px-4 py-3 rounded shadow-[0px_0px_8px_0px_rgba(0,0,0,0.12)]">
        <div className="flex gap-2 grow items-center min-w-0">
          <div className="shrink-0 w-5 h-5">
            <svg className="w-5 h-5 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-medium leading-4 relative shrink-0 text-xs text-[#121313] tracking-[0.12px] overflow-ellipsis overflow-hidden">
            {message}
          </p>
        </div>
        <div className="flex gap-2 items-start relative shrink-0">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="box-border flex gap-1 h-6 items-center justify-center px-2 py-1 rounded shrink-0 hover:bg-[#e8ebeb]"
            >
              <p className="font-medium leading-4 relative shrink-0 text-xs text-[#4b595c] text-center tracking-[0.12px] whitespace-pre">
                {actionLabel}
              </p>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex gap-1 items-center justify-center max-h-6 min-w-6 relative rounded shrink-0 w-6 h-6 hover:bg-[#e8ebeb]"
          >
            <svg className="w-4 h-4 text-[#121313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

