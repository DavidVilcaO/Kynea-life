'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, MapPin, ChevronRight, Star, Music2, Users, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import ClassCard from '@/components/ClassCard';
import { mockClasses, mockTeachers } from '@/lib/mockData';

const CATEGORIES = [
  { name: 'Salsa', emoji: '🌶️', color: 'bg-red-50 text-red-600 border-red-100' },
  { name: 'Bachata', emoji: '🌹', color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { name: 'Heels', emoji: '👠', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { name: 'Hip Hop', emoji: '🎤', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Jazz Funk', emoji: '🎷', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { name: 'K-pop', emoji: '⭐', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { name: 'Contemporáneo', emoji: '🎭', color: 'bg-green-50 text-green-600 border-green-100' },
  { name: 'Ballet', emoji: '🩰', color: 'bg-rose-50 text-rose-600 border-rose-100' },
];

const STATS = [
  { label: 'Clases activas', value: '240+' },
  { label: 'Profesores verificados', value: '80+' },
  { label: 'Estilos disponibles', value: '19' },
  { label: 'Ciudades en Perú', value: '5' },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Lima');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    router.push(`/buscar?${params.toString()}`);
  };

  const featured = mockClasses.filter(c => c.status === 'active').slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative min-h-[600px] bg-gradient-to-br from-purple-900 via-purple-700 to-violet-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-300 rounded-full blur-3xl" />
        </div>

        <Header transparent />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white/90 text-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Music2 className="w-4 h-4" />
              La primera plataforma integral de danza en el Perú
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              Encuentra tu próxima
              <span className="block text-violet-300">clase de danza</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Explora clases, talleres y academias cerca de ti. Conecta con los mejores profesores del Perú.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Salsa, heels, bachata, jazz funk…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none py-2"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-100">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="text-sm text-gray-700 outline-none bg-transparent py-2 pr-2"
                >
                  <option>Lima</option>
                  <option>Arequipa</option>
                  <option>Cusco</option>
                  <option>Trujillo</option>
                  <option>Piura</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
              >
                Buscar clases
              </button>
            </form>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Estilos populares</h2>
            <p className="text-gray-500 text-sm mt-1">¿Qué quieres bailar hoy?</p>
          </div>
          <Link href="/buscar" className="text-sm text-purple-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              href={`/buscar?style=${encodeURIComponent(cat.name)}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${cat.color} hover:scale-105 transition-transform cursor-pointer`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Classes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Clases disponibles esta semana</h2>
            <p className="text-gray-500 text-sm mt-1">Seleccionadas para ti en Lima</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/mapa"
              className="text-sm text-gray-600 font-medium border border-gray-200 px-4 py-2 rounded-xl hover:border-purple-300 transition-colors"
            >
              Ver en mapa
            </Link>
            <Link
              href="/buscar"
              className="text-sm text-purple-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(cls => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Academias y profesores destacados</h2>
              <p className="text-gray-500 text-sm mt-1">Los mejores del Perú en un solo lugar</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTeachers.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{t.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{t.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-gray-700">{t.rating}</span>
                  <span className="text-xs text-gray-400">· {t.totalClasses} clases</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{t.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {t.styles.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.district}, {t.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for teachers */}
      <section className="bg-gradient-to-br from-purple-600 to-violet-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">¿Eres profesor o academia?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Publica tus clases gratis y llega a cientos de alumnos en todo el Perú. Gestiona tus horarios, cupos y contactos desde un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth?tab=register"
              className="bg-white text-purple-700 font-bold px-8 py-4 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              Publicar mi primera clase <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/buscar"
              className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              Ver cómo funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-black text-lg">kynea</span>
            </div>
            <p className="text-sm">© 2026 Kynea. La primera plataforma integral de danza en el Perú.</p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-white transition-colors">Términos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
