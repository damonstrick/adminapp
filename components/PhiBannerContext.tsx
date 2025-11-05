'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PhiBannerContextType {
  showPhiBanner: boolean;
  setShowPhiBanner: (show: boolean) => void;
}

const PhiBannerContext = createContext<PhiBannerContextType | undefined>(undefined);

export function PhiBannerProvider({ children }: { children: ReactNode }) {
  // Load from localStorage on mount, default to true
  const [showPhiBanner, setShowPhiBannerState] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('phiBannerEnabled');
    if (stored !== null) {
      setShowPhiBannerState(stored === 'true');
    }
  }, []);

  const setShowPhiBanner = (show: boolean) => {
    setShowPhiBannerState(show);
    localStorage.setItem('phiBannerEnabled', show.toString());
  };

  return (
    <PhiBannerContext.Provider value={{ showPhiBanner, setShowPhiBanner }}>
      {children}
    </PhiBannerContext.Provider>
  );
}

export function usePhiBanner() {
  const context = useContext(PhiBannerContext);
  if (!context) {
    throw new Error('usePhiBanner must be used within PhiBannerProvider');
  }
  return context;
}

