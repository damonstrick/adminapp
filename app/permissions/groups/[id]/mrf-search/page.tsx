import { Suspense } from 'react';
import MRFSearchProductSettings from '@/components/MRFSearchProductSettings';

export default function MRFSearchProductSettingsPage({ 
  params,
}: { 
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MRFSearchProductSettings groupId={params.id} />
    </Suspense>
  );
}

