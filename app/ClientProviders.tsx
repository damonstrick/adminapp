'use client';

import { ToastProvider } from '../components/ToastProvider';
import { PhiBannerProvider } from '../components/PhiBannerContext';
import { PermissionsPanelProvider } from '../components/PermissionsPanelContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PhiBannerProvider>
        <PermissionsPanelProvider>
          {children}
        </PermissionsPanelProvider>
      </PhiBannerProvider>
    </ToastProvider>
  );
}

