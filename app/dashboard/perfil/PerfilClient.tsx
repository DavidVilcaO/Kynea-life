'use client';
import { useState, useTransition, useRef } from 'react';
import { Save, Upload, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DANCE_STYLES } from '@/lib/mockData';
import { updateProfile } from '@/lib/actions/classes';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  name: string | null;
  bio: string | null;
  city: string | null;
  district: string | null;
  years_experience: number | null;
  whatsapp: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
  dance_styles: string[] | null;
  photo_url: string | null;
}

export default function PerfilClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(profile.photo_url ?? '');

  const [name, setName] = useState(profile.name ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [city, setCity] = useState(profile.city ?? '');
  const [district, setDistrict] = useState(profile.district ?? '');
  const [years, setYears] = useState(String(profile.years_experience ?? ''));
  const parseWa = (wa: string) => {
    const CODES = ['+51', '+1', '+34', '+57', '+56', '+54', '+52', '+58', '+593'];
    if (!wa) return { code: '+51', number: '' };
    const m = wa.match(/^(\+\d{1,3})(.*)/);
    if (m) {
      const code = CODES.find(c => c === m[1]) ?? '+51';
      return { code, number: m[2].trim().replace(/\D/g, '') };
    }
    return { code: '+51', number: wa.replace(/\D/g, '') };
  };
  const parsed = parseWa(profile.whatsapp ?? '');
  const [waCode, setWaCode] = useState(parsed.code);
  const [waNumber, setWaNumber] = useState(parsed.number);
  const [instagram, setInstagram] = useState(profile.instagram ?? '');
  const [tiktok, setTiktok] = useState(profile.tiktok ?? '');
  const [youtube, setYoutube] = useState(profile.youtube ?? '');
  const [website, setWebsite] = useState(profile.website ?? '');
  const [styles, setStyles] = useState<string[]>(profile.dance_styles ?? []);

  const toggleStyle = (s: string) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handlePhotoUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) { setError('La foto debe ser menor a 2MB'); return; }
    setUploadingPhoto(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No autenticado');
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${session.user.id}/profile.${ext}`;
      const { error: upErr } = await supabase.storage.from('class-images').upload(path, file, { upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data: { publicUrl } } = supabase.storage.from('class-images').getPublicUrl(path);
      setPhotoUrl(publicUrl);
      await updateProfile({ photo_url: publicUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleSave = () => {
    setError('');
    setSaved(false);
    startTransition(async () => {
      try {
        await updateProfile({
          name,
          bio,
          city,
          district,
          years_experience: years ? parseInt(years) : undefined,
          whatsapp: waNumber ? `${waCode}${waNumber}` : '',
          instagram,
          tiktok,
          youtube,
          website,
          dance_styles: styles,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al guardar');
      }
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Mi perfil</h1>
        <p className="text-neutral-500 text-sm mt-1">Esto es lo que verán los alumnos en tu página pública</p>
      </div>

      <div className="space-y-6">
        {/* Photo */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Foto / Logo</h2>
          <div className="flex items-center gap-5">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }}
            />
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-24 h-24 rounded-xl object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-neutral-200 flex items-center justify-center text-3xl font-bold text-neutral-500">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 text-sm font-semibold text-neutral-900 border border-neutral-200 px-4 py-2 rounded-btn hover:bg-neutral-100 mb-2 disabled:opacity-50"
              >
                {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingPhoto ? 'Subiendo…' : 'Cambiar foto'}
              </button>
              <p className="text-xs text-neutral-400">PNG o JPG · Máx. 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Información pública</h2>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Nombre público</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Bio corta</label>
            <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900 resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Ciudad</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Distrito</label>
              <input type="text" value={district} onChange={e => setDistrict(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Años de experiencia</label>
              <input type="number" min="0" value={years} onChange={e => setYears(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
            </div>
          </div>
        </div>

        {/* Styles */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Estilos que enseñas</h2>
          <div className="flex flex-wrap gap-2">
            {DANCE_STYLES.map(s => (
              <button key={s} onClick={() => toggleStyle(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  styles.includes(s)
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-900'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Contact & social */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Contacto y redes</h2>

          {/* WhatsApp — split country code + number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">WhatsApp</label>
            <div className="flex gap-2">
              <select
                value={waCode}
                onChange={e => setWaCode(e.target.value)}
                className="border border-neutral-200 rounded-xl px-3 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900 bg-white shrink-0"
              >
                <option value="+51">🇵🇪 +51</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+57">🇨🇴 +57</option>
                <option value="+56">🇨🇱 +56</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+52">🇲🇽 +52</option>
                <option value="+58">🇻🇪 +58</option>
                <option value="+593">🇪🇨 +593</option>
              </select>
              <input
                type="tel"
                value={waNumber}
                onChange={e => setWaNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="999 999 999"
                className="flex-1 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900"
              />
            </div>
            <p className="text-xs text-neutral-400 mt-1">Solo números, sin ceros iniciales ni guiones. Ej: 999999999</p>
          </div>

          {[
            { label: 'Instagram', value: instagram, set: setInstagram },
            { label: 'TikTok', value: tiktok, set: setTiktok },
            { label: 'YouTube', value: youtube, set: setYoutube },
            { label: 'Sitio web', value: website, set: setWebsite },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.set(e.target.value)}
                placeholder={`Tu ${f.label.toLowerCase()}`}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-bg border-l-4 border-red text-[13px] font-medium px-4 py-3 rounded-lg text-red-700">{error}</div>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-btn transition-colors"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? '¡Guardado!' : isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-red-500 hover:bg-red-50 px-4 py-3 rounded-btn border border-neutral-200 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
