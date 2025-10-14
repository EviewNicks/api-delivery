'use client';

import { useState, useEffect } from 'react';
import { CafekuProductEnriched } from '@/lib/types';
import {
  fetchCafekuMenu,
  createCafekuProduct,
  updateCafekuProduct,
  deleteCafekuProduct,
  ApiError
} from '@/lib/api-client';
import { ProductCard } from '@/features/kelompok10/components/ProductCard';
import { ProductForm } from '@/features/kelompok10/components/ProductForm';
import { DeleteConfirmation } from '@/features/kelompok10/components/DeleteConfirmation';

type FormMode = { type: 'create' } | { type: 'edit'; product: CafekuProductEnriched } | null;
type DeleteState = { id: number; name: string } | null;

export default function CafekuDashboard() {
  const [products, setProducts] = useState<CafekuProductEnriched[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCafekuMenu();
      setProducts(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Gagal memuat data produk';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(formData: FormData) {
    try {
      await createCafekuProduct(formData);
      setFormMode(null);
      await loadProducts();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Gagal membuat produk';
      alert(message);
      throw err;
    }
  }

  async function handleUpdate(data: { title: string; description: string; price: number; stock: number }) {
    if (formMode?.type !== 'edit') return;

    try {
      await updateCafekuProduct(formMode.product.id, data);
      setFormMode(null);
      await loadProducts();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Gagal mengupdate produk';
      alert(message);
      throw err;
    }
  }

  async function handleDelete() {
    if (!deleteState) return;

    try {
      setIsDeleting(true);
      await deleteCafekuProduct(deleteState.id);
      setDeleteState(null);
      await loadProducts();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Gagal menghapus produk';
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-neutral-800">
              Cafeku - Menu Management
            </h1>
            <button
              onClick={() => setFormMode({ type: 'create' })}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              + Tambah Produk
            </button>
          </div>
          <p className="text-neutral-600">
            Kelompok 10 - Sistem Manajemen Menu Kafe
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-neutral-600">Memuat data menu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={loadProducts}
                  className="mt-2 text-sm text-red-800 hover:text-red-900 font-medium underline"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
            <p className="text-neutral-600 mb-4">Belum ada produk menu</p>
            <button
              onClick={() => setFormMode({ type: 'create' })}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-md font-medium transition-colors"
            >
              Tambah Produk Pertama
            </button>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Menampilkan {products.length} produk
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={(p) => setFormMode({ type: 'edit', product: p })}
                  onDelete={(id) => setDeleteState({ id, name: product.title })}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {formMode && (
        <ProductForm
          mode={formMode.type}
          product={formMode.type === 'edit' ? formMode.product : undefined}
          onSubmit={formMode.type === 'create' ? handleCreate : handleUpdate}
          onCancel={() => setFormMode(null)}
        />
      )}

      {deleteState && (
        <DeleteConfirmation
          productName={deleteState.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteState(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
