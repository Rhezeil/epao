
import { Suspense } from 'react';
import { NotFoundClientContent } from '@/components/NotFoundClientContent';

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Diagnostics...</div>}>
      <NotFoundClientContent />
    </Suspense>
  );
}
