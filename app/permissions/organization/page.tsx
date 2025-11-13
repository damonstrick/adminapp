'use client';

import { Suspense } from 'react';
import EntityProfile from '@/components/EntityProfile';

function OrganizationProfilePageContent() {
  // Use a fixed organization ID - in a real app, this would come from context or auth
  const organizationId = 'organization-1';
  
  return <EntityProfile entityId={organizationId} />;
}

export default function OrganizationProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrganizationProfilePageContent />
    </Suspense>
  );
}

