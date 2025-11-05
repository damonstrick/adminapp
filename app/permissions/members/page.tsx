'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import MembersContent, { TOTAL_MEMBERS } from '@/components/MembersContent';
import AddMemberModal from '@/components/AddMemberModal';
import TableSkeleton from '@/components/TableSkeleton';
import { usePermissionsPanel } from '@/components/PermissionsPanelContext';

export default function MembersPage() {
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
        title="Members" 
        description="Manage organization members and their access"
        count={TOTAL_MEMBERS}
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#16696d] text-white rounded-lg text-xs font-medium hover:bg-[#0d5256]"
          >
            Add member
          </button>
        }
      />
      {isLoading ? (
        <TableSkeleton columns={5} rows={10} hasSearch={true} hasSearchActions={true} />
      ) : (
        <MembersContent />
      )}
      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        existingMembers={[
          'sarah.johnson@commonspirit.org',
          'michael.chen@commonspirit.org',
          'emily.rodriguez@commonspirit.org',
          'david.kim@commonspirit.org',
          'jessica.martinez@commonspirit.org',
          'robert.taylor@commonspirit.org',
          'amanda.white@commonspirit.org',
          'james.wilson@commonspirit.org',
          'lisa.anderson@commonspirit.org',
          'chris.brown@commonspirit.org',
          'michelle.davis@commonspirit.org',
          'daniel.garcia@commonspirit.org',
          'jennifer.lee@commonspirit.org',
          'matthew.harris@commonspirit.org',
          'nicole.thompson@commonspirit.org',
          'andrew.moore@commonspirit.org',
          'stephanie.clark@commonspirit.org',
          'kevin.lewis@commonspirit.org',
          'rachel.walker@commonspirit.org',
          'brian.hall@commonspirit.org',
          'lauren.allen@commonspirit.org',
          'ryan.young@commonspirit.org',
          'megan.king@commonspirit.org',
          'justin.wright@commonspirit.org',
          'hannah.lopez@commonspirit.org',
          'jared.kaufman@gmail.com',
        ]}
      />
    </div>
  );
}

