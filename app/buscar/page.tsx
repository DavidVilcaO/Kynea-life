'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, Map, List, X } from 'lucide-react';
import Header from '@/components/Header';
import ClassCard from '@/components/ClassCard';
import FilterPanel, { Filters } from '@/components/FilterPanel';
import { mockClasses } from '@/lib/mockData';
import { DanceClass } from '@/lib/types';

const defaultFilters: Filters = {
  city: '', district: '', styles: [], level: '', days: [],
  timeOfDay: '', modality: '', priceRange: '', type: '', withSpots: false,
};

function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    styles: searchParams.get('style') ? [searchParams.get('style')!] : [],
    city: searchParams.get('city') || '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Recomendados');

  const results = mockClasses.filter(cls => {
    if (query && !cls.title.toLowerCase().includes(query.toLowerCase()) &&
        !cls.style.toLowerCase().includes(query.toLowerCase()) &&
        !cls.teacher.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (filters.styles.length && !filters.styles.includes(cls.style)) return false;
    if (filters.level && cls.level !== filters.level) return false;
    if (filters.modality && cls.modality !== filters.modality) return false;
    if (filters.withSpots && cls.availableSpots === 0) return false;
    if (filters.type && cls.type !== filters.type.toLowerCase()) return false;
    if (filters.days.length) {
      const classdays = cls.timeSlots.flatMap(s => s.days);
      if (!filters.days.some(d => classdays.includes(d))) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Busca por estilo, profesor o academia…"
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-colors md:hidden ${
              showFilters ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>

          <Link
            href="/mapa"
            className="hidden md:flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:border-purple-300 transition-colors"
          >
            <Map className="w-4 h-4" />
            Ver mapa
          </Link>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="hidden md:block text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 outline-none bg-white"
          >
            {['Recomendados', 'Menor precio', 'Próximamente', 'Mejor disponibilidad'].map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Active filter chips */}
        {(filters.styles.length > 0 || filters.level || filters.modality) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex gap-2 overflow-x-auto">
            {filters.styles.map(s => (
              <span key={s} className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full whitespace-nowrap">
                {s}
                <button onClick={() => setFilters(f => ({ ...f, styles: f.styles.filter(x => x !== s) }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.level && (
              <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {filters.level}
                <button onClick={() => setFilters(f => ({ ...f, level: '' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.modality && (
              <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {filters.modality}
                <button onClick={() => setFilters(f => ({ ...f, modality: '' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-36">
            <h3 className="font-bold text-gray-900 mb-4">Filtros</h3>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Mobile filter modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Filtros</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <FilterPanel filters={filters} onChange={setFilters} />
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-4 bg-purple-600 text-white font-semibold py-3 rounded-xl"
              >
                Ver {results.length} resultado{results.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">{results.length}</span> clase{results.length !== 1 ? 's' : ''} encontrada{results.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <List className="w-4 h-4" />
              </button>
              <Link href="/mapa" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <Map className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🕺</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sin resultados</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                No encontramos clases con esos filtros. Prueba cambiando la fecha, ciudad o estilo.
              </p>
              <button
                onClick={() => { setFilters(defaultFilters); setQuery(''); }}
                className="mt-6 text-purple-600 font-medium text-sm border border-purple-200 px-6 py-2 rounded-xl hover:bg-purple-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map(cls => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Cargando...</div></div>}>
      <SearchResults />
    </Suspense>
  );
}
