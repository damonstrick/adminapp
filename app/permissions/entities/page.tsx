'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import AnalyzeContent, { TOTAL_ENTITIES } from '@/components/AnalyzeContent';
import CreateEntityModal from '@/components/CreateEntityModal';
import TableSkeleton from '@/components/TableSkeleton';
import { usePermissionsPanel } from '@/components/PermissionsPanelContext';

export default function EntitiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsPanelOpen } = usePermissionsPanel();

  useEffect(() => {
    // Close permissions panel on mount
    setIsPanelOpen(false);
  }, [setIsPanelOpen]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <PageHeader 
        title="Entities" 
        description="Manage entities and their configurations"
        count={TOTAL_ENTITIES}
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]"
          >
            Create entity
          </button>
        }
      />
      {isLoading ? (
        <TableSkeleton columns={5} rows={10} hasSearch={true} hasSearchActions={false} />
      ) : (
        <AnalyzeContent />
      )}
      <CreateEntityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

