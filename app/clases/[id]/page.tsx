import { notFound } from 'next/navigation';
import { fetchClassById } from '@/lib/queries/classes';
import ClaseDetailClient from './ClaseDetailClient';

export default async function ClaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cls = await fetchClassById(id);

  if (!cls || cls.status !== 'published') notFound();

  return <ClaseDetailClient cls={cls} />;
}
