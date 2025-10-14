'use client';

import { useState } from 'react';
import { updateReservation, ApiError } from '@/lib/api-client';
import type { HouseCafeReservationEnriched } from '@/lib/types';
import { ReservationForm } from './ReservationForm';

interface EditReservationModalProps {
  isOpen: boolean;
  reservation: HouseCafeReservationEnriched | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditReservationModal({
  isOpen,
  reservation,
  onClose,
  onSuccess
}: EditReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !reservation) return null;

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await updateReservation(reservation.id, data);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak terduga');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-800">
            Edit Reservasi
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Perbarui informasi reservasi
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <ReservationForm
            initialData={reservation}
            onSubmit={handleSubmit}
            onCancel={onClose}
            mode="edit"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
