'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, PlusCircle, Upload, User,
  MessageCircle, Settings, Music2, LogOut,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/mis-clases', label: 'Mis clases', icon: BookOpen },
  { href: '/dashboard/crear-clase', label: 'Crear clase', icon: PlusCircle },
  { href: '/dashboard/importar-csv', label: 'Importar CSV', icon: Upload },
  { href: '/dashboard/perfil', label: 'Perfil', icon: User },
  { href: '/dashboard/contactos', label: 'Contactos', icon: MessageCircle },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900">kynea</span>
          </Link>
        </div>

        {/* Profile mini */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=80&q=80"
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">Academia Ritmo Latino</p>
              <p className="text-xs text-gray-500">academia</p>
            </div>
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
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-purple-600' : ''}`} />
                {item.label}
                {item.label === 'Crear clase' && (
                  <span className="ml-auto text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded-full">+</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 py-2">
        <div className="flex justify-around">
          {NAV.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                  active ? 'text-purple-600' : 'text-gray-400'
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
