'use client';

import { useState } from 'react';
import { createReservation, ApiError } from '@/lib/api-client';
import type { HouseCafeReservation } from '@/lib/types';
import { ReservationForm } from './ReservationForm';

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateReservationModal({
  isOpen,
  onClose,
  onSuccess
}: CreateReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (data: Omit<HouseCafeReservation, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);
      await createReservation(data);
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
            Buat Reservasi Baru
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Isi formulir di bawah untuk membuat reservasi
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <ReservationForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            mode="create"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
