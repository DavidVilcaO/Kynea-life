'use client';
import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { DANCE_STYLES } from '@/lib/mockData';

export default function PerfilPage() {
  const [styles, setStyles] = useState<string[]>(['Salsa', 'Bachata', 'Cha-cha-chá']);

  const toggleStyle = (s: string) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
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
            <img
              src="https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=200&q=80"
              alt="Profile"
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div>
              <button className="flex items-center gap-2 text-sm font-semibold text-neutral-900 border border-neutral-200 px-4 py-2 rounded-btn hover:bg-neutral-100 mb-2">
                <Upload className="w-4 h-4" /> Cambiar foto
              </button>
              <p className="text-xs text-neutral-400">PNG o JPG · Máx. 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Información pública</h2>
          {[
            { label: 'Nombre público', defaultValue: 'Academia Ritmo Latino' },
            { label: 'Bio corta', defaultValue: 'Academia especializada en bailes latinos con más de 10 años formando bailarines en Lima.', textarea: true },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">{f.label}</label>
              {f.textarea ? (
                <textarea rows={3} defaultValue={f.defaultValue} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900 resize-none" />
              ) : (
                <input type="text" defaultValue={f.defaultValue} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
              )}
            </div>
          ))}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Ciudad', defaultValue: 'Lima' },
              { label: 'Distrito', defaultValue: 'Miraflores' },
              { label: 'Años de experiencia', defaultValue: '10' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">{f.label}</label>
                <input type="text" defaultValue={f.defaultValue} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
              </div>
            ))}
          </div>
        </div>

        {/* Styles */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Estilos que enseñas</h2>
          <div className="flex flex-wrap gap-2">
            {DANCE_STYLES.map(s => (
              <button
                key={s}
                onClick={() => toggleStyle(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  styles.includes(s)
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Contact & social */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-neutral-900">Contacto y redes</h2>
          {[
            { label: 'WhatsApp', defaultValue: '+51987654321' },
            { label: 'Email', defaultValue: 'contacto@ritmolatinoac.com' },
            { label: 'Instagram', defaultValue: '@ritmolatinoac' },
            { label: 'TikTok', defaultValue: '@ritmolatinoac' },
            { label: 'YouTube', defaultValue: '' },
            { label: 'Sitio web', defaultValue: '' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">{f.label}</label>
              <input type="text" defaultValue={f.defaultValue} placeholder={`Tu ${f.label.toLowerCase()}`} className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-900" />
            </div>
          ))}
        </div>

        <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white font-bold px-6 py-3 rounded-btn transition-colors">
          <Save className="w-4 h-4" /> Guardar cambios
        </button>
      </div>
    </div>
  );
}
