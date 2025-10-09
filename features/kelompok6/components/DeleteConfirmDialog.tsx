'use client';

import { useState } from 'react';
import { deleteReservation, ApiError } from '@/lib/api-client';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  reservationId: number | null;
  reservationName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  reservationId,
  reservationName,
  onClose,
  onSuccess
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !reservationId) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteReservation(reservationId);
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
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>

          <h3 className="text-lg font-bold text-neutral-800 text-center mt-4">
            Hapus Reservasi?
          </h3>
          <p className="text-neutral-600 text-center mt-2">
            Apakah Anda yakin ingin menghapus reservasi atas nama{' '}
            <span className="font-semibold">{reservationName}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md font-medium hover:bg-neutral-50 transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Menghapus...' : 'Hapus Reservasi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
