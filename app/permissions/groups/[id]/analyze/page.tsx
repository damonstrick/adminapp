import { Suspense } from 'react';
import AnalyzeProductSettings from '@/components/AnalyzeProductSettings';

export default function AnalyzeProductSettingsPage({ 
  params,
}: { 
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyzeProductSettings groupId={params.id} />
    </Suspense>
  );
}

