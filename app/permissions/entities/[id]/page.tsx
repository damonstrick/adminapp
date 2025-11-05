'use client';

import { Suspense } from 'react';
import EntityProfile from '@/components/EntityProfile';

function EntityProfilePageContent({ params }: { params: { id: string } }) {
  return <EntityProfile entityId={params.id} />;
}

export default function EntityProfilePage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityProfilePageContent params={params} />
    </Suspense>
  );
}


