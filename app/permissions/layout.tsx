'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TopNavigation from '@/components/TopNavigation';
import LeftNavigation from '@/components/LeftNavigation';
import SecondaryNav from '@/components/SecondaryNav';
import Banner from '@/components/Banner';
import { usePermissionsPanel } from '@/components/PermissionsPanelContext';

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPanelOpen, setIsPanelOpen } = usePermissionsPanel();
  const pathname = usePathname();
  
  // Close panel when navigating away from pages that use it
  useEffect(() => {
    // Check if we're on a product settings page (analyze or clear-contracts)
    const isProductSettingsPage = pathname?.match(/\/(analyze|clear-contracts)$/);
    if (!isProductSettingsPage && isPanelOpen) {
      setIsPanelOpen(false);
    }
  }, [pathname, isPanelOpen, setIsPanelOpen]);
  
  return (
    <div className="bg-surface-bg-white relative size-full min-h-screen">
      <TopNavigation />
      <Banner />
      <LeftNavigation />
      <div className="ml-[64px] fixed bottom-0 left-0 right-0 overflow-y-auto" style={{ top: '96px' }}>
        <div className="flex justify-center px-4 pb-8 pt-[65px] min-h-full" style={{ marginRight: isPanelOpen ? '400px' : '0' }}>
          <div className="flex gap-[40px] items-start w-[890px]">
            <div className="sticky self-start" style={{ top: '65px' }}>
              <SecondaryNav />
            </div>
            <div className="flex-1" style={{ width: '600px' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

