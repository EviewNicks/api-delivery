'use client';

import { useState } from 'react';
import { deleteGadgetProduct } from '@/lib/api-client';

interface DeleteConfirmationProps {
  productId: string;
  productName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmation({
  productId,
  productName,
  onSuccess,
  onCancel
}: DeleteConfirmationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteGadgetProduct(productId);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="text-center mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Hapus Produk
          </h3>
          <p className="text-sm text-neutral-600 mb-1">
            Apakah Anda yakin ingin menghapus produk ini?
          </p>
          <p className="text-sm font-medium text-neutral-900">
            "{productName}"
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-neutral-200 hover:bg-neutral-300 disabled:bg-neutral-100 text-neutral-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}