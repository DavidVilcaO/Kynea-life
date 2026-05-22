import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PerfilClient from './PerfilClient';

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, bio, city, district, years_experience, whatsapp, instagram, tiktok, youtube, website, dance_styles, photo_url')
    .eq('id', user.id)
    .single();

  return <PerfilClient profile={profile ?? {
    name: null, bio: null, city: null, district: null,
    years_experience: null, whatsapp: null, instagram: null,
    tiktok: null, youtube: null, website: null,
    dance_styles: null, photo_url: null,
  }} />;
}
