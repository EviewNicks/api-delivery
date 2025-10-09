'use client';

import { useState } from 'react';
import { CafekuProductEnriched } from '@/lib/types';

interface ProductFormProps {
  mode: 'create' | 'edit';
  product?: CafekuProductEnriched;
  onSubmit: (data: FormData | { title: string; description: string; price: number; stock: number }) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ mode, product, onSubmit, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formEl = e.currentTarget;

      if (mode === 'create') {
        const formData = new FormData(formEl);
        await onSubmit(formData);
      } else {
        const data = {
          title: (formEl.elements.namedItem('title') as HTMLInputElement).value,
          description: (formEl.elements.namedItem('description') as HTMLTextAreaElement).value,
          price: parseInt((formEl.elements.namedItem('price') as HTMLInputElement).value),
          stock: parseInt((formEl.elements.namedItem('stock') as HTMLInputElement).value),
        };
        await onSubmit(data);
      }

      formEl.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800">
            {mode === 'create' ? 'Tambah Produk Baru' : 'Edit Produk'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={product?.title}
              required
              minLength={5}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Minimal 5 karakter"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              required
              minLength={10}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Minimal 10 karakter"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              defaultValue={product?.price}
              required
              min={0}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: 35000"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 mb-1">
              Stok <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              defaultValue={product?.stock}
              required
              min={0}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: 100"
            />
          </div>

          {mode === 'create' && (
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-neutral-700 mb-1">
                Gambar <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/png"
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Format: JPG/PNG, Maksimal 2MB
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Tambah Produk' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
