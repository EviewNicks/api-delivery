'use client';

import type { HouseCafeReservationEnriched } from '@/lib/types';
import { ReservationStatusBadge } from './ReservationStatusBadge';

interface ReservationDetailProps {
  reservation: HouseCafeReservationEnriched;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReservationDetail({ reservation, onClose, onEdit, onDelete }: ReservationDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">
                Detail Reservasi
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                ID: {reservation.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Tutup"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">
              Status Reservasi
            </label>
            <ReservationStatusBadge status={reservation.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Nama Pemesan
              </label>
              <p className="text-base text-neutral-800 font-medium">
                {reservation.nama}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Email
              </label>
              <p className="text-base text-neutral-800">{reservation.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Nomor Telepon
              </label>
              <p className="text-base text-neutral-800">{reservation.telepon}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Jumlah Orang
              </label>
              <p className="text-base text-neutral-800">
                {reservation.jumlah_orang} orang
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Tanggal
              </label>
              <p className="text-base text-neutral-800">
                {reservation.date_formatted}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Waktu
              </label>
              <p className="text-base text-neutral-800">
                Pukul {reservation.time_formatted}
              </p>
            </div>
          </div>

          {reservation.catatan && (
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">
                Catatan Khusus
              </label>
              <p className="text-base text-neutral-800 bg-neutral-50 p-4 rounded-lg">
                {reservation.catatan}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-400">
              Dibuat pada:{' '}
              {new Date(reservation.created_at).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="flex gap-3">
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-3 rounded-md font-medium transition-colors"
              >
                Hapus
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-800 px-4 py-3 rounded-md font-medium transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-4 py-3 rounded-md font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
