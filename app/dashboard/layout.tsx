'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, PlusCircle, Upload, User,
  MessageCircle, Settings, LogOut, Users,
} from 'lucide-react';

const DEMO_USERS = {
  alumno: {
    name: 'Laura García',
    type: 'Alumna',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    badge: { label: 'Alumna', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  },
  profesor: {
    name: 'Sofía Vega',
    type: 'Profesora',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80',
    badge: { label: 'Profesora', bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200' },
  },
  academia: {
    name: 'Academia Ritmo Latino',
    type: 'Academia',
    photo: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=80&q=80',
    badge: { label: 'Academia', bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100' },
  },
};

const NAV_BY_ROLE = {
  alumno: [
    { href: '/dashboard/alumno', label: 'Mis clases', icon: BookOpen },
    { href: '/dashboard/perfil', label: 'Perfil', icon: User },
    { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
  ],
  profesor: [
    { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { href: '/dashboard/mis-clases', label: 'Mis clases', icon: BookOpen },
    { href: '/dashboard/crear-clase', label: 'Crear clase', icon: PlusCircle },
    { href: '/dashboard/importar-csv', label: 'Importar CSV', icon: Upload },
    { href: '/dashboard/perfil', label: 'Perfil', icon: User },
    { href: '/dashboard/contactos', label: 'Contactos', icon: MessageCircle },
    { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
  ],
  academia: [
    { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { href: '/dashboard/mis-clases', label: 'Mis clases', icon: BookOpen },
    { href: '/dashboard/profesores', label: 'Profesores', icon: Users },
    { href: '/dashboard/crear-clase', label: 'Crear clase', icon: PlusCircle },
    { href: '/dashboard/importar-csv', label: 'Importar CSV', icon: Upload },
    { href: '/dashboard/perfil', label: 'Perfil', icon: User },
    { href: '/dashboard/contactos', label: 'Contactos', icon: MessageCircle },
    { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
  ],
};

type Role = 'alumno' | 'profesor' | 'academia';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('demo_role') as Role) || 'academia';
    }
    return 'academia';
  });

  useEffect(() => {
    localStorage.setItem('demo_role', role);
  }, [role]);

  const user = DEMO_USERS[role];
  const NAV = NAV_BY_ROLE[role];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Kynea" width={100} height={32} priority />
          </Link>
        </div>

        {/* Profile mini */}
        <div className="px-4 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <img
              src={user.photo}
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-bold text-neutral-900">{user.name}</p>
              <p className="text-xs text-neutral-500">{user.type.toLowerCase()}</p>
              <span className={`text-[10px] font-bold ${user.badge.bg} ${user.badge.text} border ${user.badge.border} px-2 py-0.5 rounded-full`}>
                {user.badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Demo role switcher */}
        <div className="px-3 py-3 border-b border-neutral-100">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-1">Ver como</p>
          <div className="flex gap-1">
            {(['alumno', 'profesor', 'academia'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg capitalize transition-all ${
                  role === r ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {r === 'alumno' ? 'Alumno' : r === 'profesor' ? 'Profesor' : 'Academia'}
              </button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {item.label === 'Crear clase' && (role === 'profesor' || role === 'academia') && (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-neutral-900 text-white'}`}>+</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 px-2 py-2">
        <div className="flex justify-around">
          {NAV.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                  active ? 'text-neutral-900' : 'text-neutral-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
