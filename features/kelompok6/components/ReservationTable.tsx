'use client';

import type { HouseCafeReservationEnriched } from '@/lib/types';
import { ReservationStatusBadge } from './ReservationStatusBadge';

interface ReservationTableProps {
  reservations: HouseCafeReservationEnriched[];
  onViewDetail: (id: number) => void;
}

export function ReservationTable({ reservations, onViewDetail }: ReservationTableProps) {
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.tanggal}T${a.jam}`);
    const dateB = new Date(`${b.tanggal}T${b.jam}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="bg-white shadow-sm rounded-lg border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Tanggal & Waktu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Jumlah Orang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {sortedReservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  Tidak ada data reservasi
                </td>
              </tr>
            ) : (
              sortedReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => onViewDetail(reservation.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-800">
                      {reservation.nama}
                    </div>
                    <div className="text-sm text-neutral-500">{reservation.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-800">
                      {reservation.date_formatted}
                    </div>
                    <div className="text-sm text-neutral-500">
                      Pukul {reservation.time_formatted}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-800">
                      {reservation.jumlah_orang} orang
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ReservationStatusBadge status={reservation.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(reservation.id);
                      }}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
