'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import GroupsContent, { TOTAL_GROUPS } from '@/components/GroupsContent';
import CreateGroupModal from '@/components/CreateGroupModal';
import TableSkeleton from '@/components/TableSkeleton';
import { usePermissionsPanel } from '@/components/PermissionsPanelContext';

export default function GroupsPage() {
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
        title="Groups" 
        description="Manage groups and group permissions"
        count={TOTAL_GROUPS}
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]"
          >
            Create Group
          </button>
        }
      />
      {isLoading ? (
        <TableSkeleton columns={5} rows={10} hasSearch={true} hasSearchActions={false} />
      ) : (
        <GroupsContent />
      )}
      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

