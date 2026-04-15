import { Suspense } from 'react';
import { ReportsContent } from './ReportsContent';

export default function ReportsPage() {
  return (
    <Suspense fallback={null}>
      <ReportsContent />
    </Suspense>
  );
}
