'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { MoovsDataPrep } from '@/components/moovs-data-prep';

function DataPrepContent() {
  const searchParams = useSearchParams();
  const operatorId = searchParams.get('anon_operator_id') || searchParams.get('operator_id') || '';

  return <MoovsDataPrep operatorId={operatorId} />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <DataPrepContent />
    </Suspense>
  );
}
