'use client';

import { useState } from 'react';
import { deleteProduct } from '@/lib/api-client';
import type { Product } from '@/lib/types';

interface ProductActionsProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductActions({ product, onEdit, onDelete }: ProductActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteProduct(product.id);
      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus produk');
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-2">Hapus Produk?</h3>
          <p className="text-gray-600 mb-4">
            Apakah Anda yakin ingin menghapus <strong>{product.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Edit
      </button>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Hapus
      </button>
    </div>
  );
}
