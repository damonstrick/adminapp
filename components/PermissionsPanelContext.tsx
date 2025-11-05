'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PermissionsPanelContextType {
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
}

const PermissionsPanelContext = createContext<PermissionsPanelContextType | undefined>(undefined);

export function PermissionsPanelProvider({ children }: { children: ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <PermissionsPanelContext.Provider value={{ isPanelOpen, setIsPanelOpen }}>
      {children}
    </PermissionsPanelContext.Provider>
  );
}

export function usePermissionsPanel() {
  const context = useContext(PermissionsPanelContext);
  if (context === undefined) {
    throw new Error('usePermissionsPanel must be used within a PermissionsPanelProvider');
  }
  return context;
}


