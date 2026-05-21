import Link from 'next/link';
import { Music2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Music2 className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-6xl font-black text-purple-600 mb-4">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Esta página no existe</h2>
        <p className="text-gray-500 mb-8">Parece que esta clase ya terminó o fue removida. Pero hay muchas más esperándote.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Explorar clases
        </Link>
      </div>
    </div>
  );
}
