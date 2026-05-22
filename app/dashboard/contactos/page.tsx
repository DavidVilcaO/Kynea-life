'use client';
import { MessageCircle, Phone, Clock } from 'lucide-react';
import { mockClasses } from '@/lib/mockData';

const CONTACTS = [
  { name: 'María Gonzáles', phone: '+51987123456', class: mockClasses[0], time: 'Hace 2 horas', read: false },
  { name: 'Carlos Mamani', phone: '+51956789012', class: mockClasses[1], time: 'Hace 5 horas', read: false },
  { name: 'Lucía Torres', phone: '+51934567890', class: mockClasses[0], time: 'Ayer', read: true },
  { name: 'Diego Ruiz', phone: '+51912345678', class: mockClasses[2], time: 'Ayer', read: true },
  { name: 'Ana Villanueva', phone: '+51998765432', class: mockClasses[4], time: 'Hace 3 días', read: true },
];

export default function ContactosPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Contactos</h1>
        <p className="text-neutral-500 text-sm mt-1">{CONTACTS.filter(c => !c.read).length} contactos nuevos sin leer</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-neutral-50">
          {CONTACTS.map((contact, i) => (
            <div key={i} className={`flex items-start gap-4 p-5 hover:bg-neutral-50 transition-colors ${!contact.read ? 'bg-neutral-50/30' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                !contact.read ? 'bg-neutral-900' : 'bg-neutral-100'
              }`}>
                <span className={`font-bold text-sm ${!contact.read ? 'text-white' : 'text-neutral-700'}`}>{contact.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-neutral-900 text-sm">{contact.name}</p>
                  {!contact.read && (
                    <span className="w-2 h-2 bg-neutral-900 rounded-full" />
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Interesado en: <span className="text-neutral-900 font-medium">{contact.class.title}</span>
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {contact.time}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {contact.phone}
                  </span>
                </div>
              </div>
              <a
                href={`https://wa.me/${contact.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-xl transition-colors shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
