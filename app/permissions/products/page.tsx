'use client';

import { useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import ProductsContent from '@/components/ProductsContent';
import { usePermissionsPanel } from '@/components/PermissionsPanelContext';

export default function ProductsPage() {
  const { setIsPanelOpen } = usePermissionsPanel();

  useEffect(() => {
    // Close permissions panel on mount
    setIsPanelOpen(false);
  }, [setIsPanelOpen]);

  return (
    <div className="w-full">
      <PageHeader 
        title="Products & Features" 
        description="Manage products and feature access"
      />
      <ProductsContent />
    </div>
  );
}

