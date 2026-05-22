import { fetchClassById } from '@/lib/queries/classes';
import CrearClaseForm from './CrearClaseForm';
import type { DanceClass } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function CrearClasePage({ searchParams }: PageProps) {
  const params = await searchParams;

  let editClass: DanceClass | null = null;
  if (params.edit) {
    editClass = await fetchClassById(params.edit);
  }

  return <CrearClaseForm classId={params.edit ?? null} editClass={editClass} />;
}
