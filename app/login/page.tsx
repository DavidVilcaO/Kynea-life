'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Globe, Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setResetSent(true);
    setResetLoading(false);
  }



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    // Fetch role to redirect correctly
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single();

    router.refresh(); // invalidate server caches
    router.push(profile?.role === 'alumno' ? '/clases' : '/dashboard');
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <Link href="/">
          <Image src="/logo.png" alt="Kynea" width={90} height={30} priority />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <h1 className="text-[24px] font-black text-neutral-900 tracking-snug mb-1">Iniciar sesión</h1>
            <p className="text-[15px] text-neutral-500 mb-6">Bienvenido de vuelta a Kynea</p>

            {forgotMode ? (
              resetSent ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <p className="text-[15px] font-semibold text-neutral-900 text-center">Revisa tu correo</p>
                  <p className="text-[13px] text-neutral-500 text-center">
                    Te enviamos un enlace a <span className="font-semibold text-neutral-700">{resetEmail}</span> para restablecer tu contraseña.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(''); }}
                    className="text-[13px] text-neutral-900 font-semibold hover:underline"
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                  <p className="text-[15px] text-neutral-500">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
                  <div>
                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Correo electrónico</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      required
                      className="input"
                    />
                  </div>
                  <button type="submit" disabled={resetLoading} className="btn-dark w-full flex items-center justify-center gap-2">
                    {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {resetLoading ? 'Enviando…' : 'Enviar enlace'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="text-[13px] text-neutral-500 hover:text-neutral-700 text-center"
                  >
                    ← Volver
                  </button>
                </form>
              )
            ) : (
              <>
                <button type="button" onClick={handleGoogle} className="w-full btn-outline mb-4">
                  <Globe className="w-4 h-4" />
                  Continuar con Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-[13px] text-neutral-400">o con correo</span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {error && (
                    <div className="bg-red-bg border-l-4 border-red text-[13px] font-medium px-4 py-3 rounded-lg text-red-700">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5">Correo electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[13px] font-semibold text-neutral-700">Contraseña</label>
                      <button
                        type="button"
                        onClick={() => setForgotMode(true)}
                        className="text-[13px] text-neutral-900 font-semibold hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        required
                        className="input pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-dark w-full mt-1 flex items-center justify-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Ingresando…' : 'Iniciar sesión'}
                  </button>
                </form>

                <p className="text-center text-[13px] text-neutral-400 mt-5">
                  ¿No tienes cuenta?{' '}
                  <Link href="/registro" className="text-neutral-900 font-semibold hover:underline">
                    Regístrate gratis
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
