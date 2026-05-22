import { Suspense } from 'react';
import { fetchPublishedClasses } from '@/lib/queries/classes';
import ClasesContent from './ClasesContent';

export default async function ClasesPage() {
  const classes = await fetchPublishedClasses();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-neutral-400 text-[15px]">
        Cargando…
      </div>
    }>
      <ClasesContent initialClasses={classes} />
    </Suspense>
  );
}
