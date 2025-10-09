'use client';

import { useState } from 'react';
import type { TripnesiaBookingEnriched } from '@/lib/types';

interface BookingListProps {
  bookings: TripnesiaBookingEnriched[];
  onEdit: (booking: TripnesiaBookingEnriched) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function BookingList({ bookings, onEdit, onDelete, isLoading }: BookingListProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return booking.is_upcoming;
    if (filter === 'past') return !booking.is_upcoming;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-500">Memuat data booking...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Mendatang
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'past'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Selesai
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          Tidak ada booking {filter !== 'all' && `untuk kategori ${filter}`}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map(booking => (
            <div
              key={booking.id}
              className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-800">
                      {booking.name}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {booking.type_label}
                    </span>
                    {booking.is_upcoming && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Mendatang
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-neutral-600">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {booking.destination}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {booking.date_formatted}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(booking)}
                    className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus booking ini?')) {
                        onDelete(booking.id);
                      }
                    }}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
