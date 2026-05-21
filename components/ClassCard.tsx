'use client';
import Link from 'next/link';
import { MapPin, Clock, Users, MessageCircle, ChevronRight } from 'lucide-react';
import { DanceClass } from '@/lib/types';
import { getStatusLabel, getStatusColor, getTypeLabel, formatPrice, formatTimeSlots } from '@/lib/mockData';

interface ClassCardProps {
  cls: DanceClass;
  compact?: boolean;
}

export default function ClassCard({ cls, compact = false }: ClassCardProps) {
  const spotsLeft = cls.availableSpots;
  const statusLabel =
    spotsLeft === 0 && cls.status === 'active'
      ? 'Sin cupos'
      : spotsLeft <= 3 && spotsLeft > 0
      ? 'Últimos cupos'
      : getStatusLabel(cls.status);

  const statusColor =
    spotsLeft === 0 && cls.status === 'active'
      ? 'bg-red-100 text-red-600'
      : spotsLeft <= 3 && spotsLeft > 0
      ? 'bg-orange-100 text-orange-600'
      : getStatusColor(cls.status);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative">
        <img
          src={cls.coverImage}
          alt={cls.title}
          className={`w-full object-cover ${compact ? 'h-40' : 'h-52'}`}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
            {getTypeLabel(cls.type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">{cls.style}</p>
            <h3 className="font-bold text-gray-900 leading-snug text-sm mt-0.5">{cls.title}</h3>
          </div>
          <span className="text-sm font-bold text-purple-700 whitespace-nowrap">
            {formatPrice(cls.priceType, cls.price, cls.currency)}
          </span>
        </div>

        <p className="text-xs text-gray-500">{cls.teacher.name} · {cls.level}</p>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{cls.district}, {cls.city}</span>
        </div>

        {!compact && (
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">{cls.shortDescription}</p>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{formatTimeSlots(cls.timeSlots)}</span>
        </div>

        {!compact && cls.availableSpots > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            <span>{cls.availableSpots} cupos disponibles</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3">
          <Link
            href={`/clase/${cls.id}`}
            className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors flex items-center justify-center gap-1"
          >
            Ver más <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={`https://wa.me/${cls.teacher.whatsapp}?text=Hola, me interesa la clase "${cls.title}"`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contactar
          </a>
        </div>
      </div>
    </div>
  );
}
