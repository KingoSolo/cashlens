import { Suspense } from 'react';
import { AnalyticsContent } from './AnalyticsContent';

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
