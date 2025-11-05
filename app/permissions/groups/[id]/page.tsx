import { Suspense } from 'react';
import GroupProfile from '@/components/GroupProfile';

export default function GroupProfilePage({ 
  params,
}: { 
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroupProfile groupId={params.id} />
    </Suspense>
  );
}

