import { Suspense } from 'react';
import ClearContractsProductSettings from '@/components/ClearContractsProductSettings';

export default function ClearContractsProductSettingsPage({ 
  params,
}: { 
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClearContractsProductSettings groupId={params.id} />
    </Suspense>
  );
}


