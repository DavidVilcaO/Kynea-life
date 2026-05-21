'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Music2 } from 'lucide-react';

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const base = transparent
    ? 'absolute top-0 left-0 right-0 z-50 bg-transparent'
    : 'sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm';

  return (
    <header className={base}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-black tracking-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>
              kynea
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/buscar"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${transparent ? 'text-white/90' : 'text-gray-600'}`}
            >
              Explorar clases
            </Link>
            <Link
              href="/mapa"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${transparent ? 'text-white/90' : 'text-gray-600'}`}
            >
              Ver en mapa
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                transparent
                  ? 'text-white border border-white/40 hover:bg-white/10'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth?tab=register"
              className="text-sm font-semibold px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Publicar clase
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className={`md:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-gray-700'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <Link href="/buscar" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
            Explorar clases
          </Link>
          <Link href="/mapa" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
            Ver en mapa
          </Link>
          <Link href="/auth" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
            Iniciar sesión
          </Link>
          <Link
            href="/auth?tab=register"
            className="text-sm font-semibold px-4 py-2 bg-purple-600 text-white rounded-lg text-center"
            onClick={() => setMobileOpen(false)}
          >
            Publicar clase
          </Link>
        </div>
      )}
    </header>
  );
}
