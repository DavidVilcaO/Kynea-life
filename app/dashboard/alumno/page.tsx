'use client';
import Link from 'next/link';
import { Clock, Star, BookOpen, CheckCircle } from 'lucide-react';

const CLASES_ACTIVAS = [
  {
    id: 'a1',
    title: 'Salsa Básico desde cero',
    teacher: 'Academia Ritmo Latino',
    style: 'Salsa',
    schedule: 'Mar y Jue · 19:00–20:30',
    location: 'Miraflores, Lima',
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&q=80',
    price: 'S/150/mes',
    status: 'activa',
    nextClass: 'Martes 28 May · 19:00',
  },
  {
    id: 'a2',
    title: 'Heels Intermedio',
    teacher: 'Sofía Vega',
    style: 'Heels',
    schedule: 'Miércoles · 20:00–21:30',
    location: 'Barranco, Lima',
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&q=80',
    price: 'S/60/clase',
    status: 'activa',
    nextClass: 'Miércoles 29 May · 20:00',
  },
];

const HISTORIAL = [
  {
    id: 'h1',
    title: 'Bachata Básico',
    teacher: 'Academia Ritmo Latino',
    style: 'Bachata',
    completedDate: 'Marzo 2026',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&q=80',
    rating: 5,
  },
  {
    id: 'h2',
    title: 'Hip Hop Freestyle',
    teacher: 'Studio Urbano',
    style: 'Hip Hop',
    completedDate: 'Febrero 2026',
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&q=80',
    rating: 4,
  },
];

const STATS = [
  { label: 'Clases activas', value: CLASES_ACTIVAS.length, icon: BookOpen, bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  { label: 'Completadas', value: HISTORIAL.length, icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
];

export default function AlumnoDashboardPage() {
  return (
    <div className="p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-black text-neutral-900 tracking-tight">Hola, Laura 👋</h1>
          <p className="text-neutral-500 text-[15px] mt-1">Descubre y gestiona tus clases</p>
        </div>
        <Link href="/clases" className="btn-dark btn-sm hidden sm:flex items-center gap-2">
          Explorar clases →
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm">
        {STATS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-neutral-200`}>
              <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${s.text}`} />
              </div>
              <p className={`text-[22px] font-black ${s.text}`}>{s.value}</p>
              <p className="text-[12px] font-medium text-neutral-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Clases activas */}
        <section>
          <h2 className="text-[17px] font-bold text-neutral-900 mb-4">Clases activas</h2>
          <div className="space-y-3">
            {CLASES_ACTIVAS.map(clase => (
              <div
                key={clase.id}
                className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start gap-4"
              >
                <img
                  src={clase.image}
                  alt={clase.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-900 text-[15px] leading-snug">{clase.title}</p>
                  <p className="text-[13px] text-neutral-500 mt-0.5">{clase.teacher}</p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">{clase.schedule}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                    <span className="text-[12px] font-semibold text-pink-600">{clase.nextClass}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[13px] font-bold text-neutral-900">{clase.price}</span>
                    <Link
                      href={`/clases/${clase.id}`}
                      className="btn-outline btn-sm text-[12px]"
                    >
                      Ver clase
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historial */}
        <section>
          <h2 className="text-[17px] font-bold text-neutral-900 mb-4">Historial de clases</h2>
          <div className="space-y-3">
            {HISTORIAL.map(item => (
              <div
                key={item.id}
                className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start gap-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-900 text-[15px] leading-snug">{item.title}</p>
                  <p className="text-[13px] text-neutral-500 mt-0.5">{item.teacher}</p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">{item.completedDate}</p>
                  <div className="flex items-center gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200 fill-neutral-200'}`}
                      />
                    ))}
                    <span className="text-[12px] text-neutral-400 ml-1">{item.style}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Explore CTA */}
      <div className="mt-8 bg-neutral-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white font-bold text-[17px]">Descubre más clases</p>
          <p className="text-neutral-400 text-[14px] mt-0.5">Explora salsa, bachata, heels y más estilos cerca de ti</p>
        </div>
        <Link
          href="/clases"
          className="bg-white text-neutral-900 font-bold text-[14px] px-5 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors shrink-0"
        >
          Explorar clases →
        </Link>
      </div>
    </div>
  );
}
