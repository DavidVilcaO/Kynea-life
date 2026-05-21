'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Music2, Globe, Zap } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    label: 'Academia Ritmo Latino',
    desc: 'Academia · 12 clases activas',
    emoji: '🏫',
    href: '/dashboard',
  },
  {
    label: 'Sofía Vega',
    desc: 'Profesora independiente · Heels & Jazz Funk',
    emoji: '💃',
    href: '/dashboard',
  },
];

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<'alumno' | 'profesor'>('alumno');
  const [authMode, setAuthMode] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', terms: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'profesor') {
      if (authMode === 'register') {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/buscar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">kynea</span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Donde la pasión por la danza cobra vida</p>
        </div>

        {/* Demo access card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-800">Acceso demo — sin registro</span>
          </div>
          <p className="text-xs text-amber-700 mb-3">Entra directamente al panel de profesor para explorar todas las funciones.</p>
          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <Link
                key={acc.label}
                href={acc.href}
                className="flex items-center gap-3 bg-white border border-amber-200 hover:border-amber-400 rounded-xl px-4 py-3 transition-colors group"
              >
                <span className="text-xl">{acc.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{acc.label}</p>
                  <p className="text-xs text-gray-500">{acc.desc}</p>
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">Demo</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* User type tabs */}
          <div className="flex border-b border-gray-100">
            {(['alumno', 'profesor'] as const).map(type => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  userType === type
                    ? 'text-purple-700 border-b-2 border-purple-600 bg-purple-50/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {type === 'alumno' ? '🕺 Soy alumno' : '🎓 Soy profesor / academia'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Auth mode toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {(['login', 'register'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    authMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              ))}
            </div>

            {/* Google button */}
            <button
              onClick={() => userType === 'profesor' ? router.push('/dashboard') : router.push('/buscar')}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors mb-4"
            >
              <Globe className="w-5 h-5" />
              Continuar con Google
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">o con correo</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Celular / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+51 999 999 999"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirmar contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={form.terms}
                      onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))}
                      className="mt-1 accent-purple-600"
                    />
                    <span className="text-xs text-gray-600">
                      Acepto los{' '}
                      <Link href="#" className="text-purple-600 underline">términos y condiciones</Link>
                      {' '}y la{' '}
                      <Link href="#" className="text-purple-600 underline">política de privacidad</Link>
                    </span>
                  </label>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
              >
                {authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            </form>

            {userType === 'profesor' && (
              <p className="text-center text-xs text-purple-600 mt-3 font-medium">
                {authMode === 'login' ? '→ Serás llevado a tu panel de gestión' : '→ Completarás tu perfil en el siguiente paso'}
              </p>
            )}

            <p className="text-center text-xs text-gray-500 mt-4">
              {authMode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-purple-600 font-semibold"
              >
                {authMode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Cargando...</div></div>}>
      <AuthContent />
    </Suspense>
  );
}
