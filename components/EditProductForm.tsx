'use client';

import { useState, useEffect } from 'react';
import { updateGadgetProduct } from '@/lib/api-client';
import type { GadgetProductEnriched, GadgetProductUpdate } from '@/lib/types';

interface EditProductFormProps {
  product: GadgetProductEnriched;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const [formData, setFormData] = useState<GadgetProductUpdate>({
    product_id: product.product_id,
    product_title: product.product_title,
    product_price: product.product_price,
    product_img1: product.product_img1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      product_id: product.product_id,
      product_title: product.product_title,
      product_price: product.product_price,
      product_img1: product.product_img1
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_title || !formData.product_price || !formData.product_img1) {
      setError('Semua field harus diisi');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateGadgetProduct(formData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupdate produk');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof GadgetProductUpdate) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">Edit Produk</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Product ID
            </label>
            <input
              type="text"
              value={formData.product_id}
              disabled
              className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500"
              placeholder="Product ID tidak dapat diubah"
            />
            <p className="text-xs text-neutral-500 mt-1">Product ID tidak dapat diubah</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              value={formData.product_title}
              onChange={handleChange('product_title')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan nama produk"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Harga
            </label>
            <input
              type="text"
              value={formData.product_price}
              onChange={handleChange('product_price')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan harga (tanpa titik/koma)"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nama File Gambar
            </label>
            <input
              type="text"
              value={formData.product_img1}
              onChange={handleChange('product_img1')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="contoh: product-name.webp"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Update Produk'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-neutral-200 hover:bg-neutral-300 disabled:bg-neutral-100 text-neutral-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}