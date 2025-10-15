'use client';

import { useState, useEffect } from 'react';
import { fetchGadgetRecommendations } from '@/lib/api-client';
import type { GadgetProductEnriched } from '@/lib/types';
import AddProductForm from '@/components/AddProductForm';
import EditProductForm from '@/components/EditProductForm';
import DeleteConfirmation from '@/components/DeleteConfirmation';

export default function Kelompok3Page() {
  const [products, setProducts] = useState<GadgetProductEnriched[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CRUD states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GadgetProductEnriched | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<{ id: string; name: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGadgetRecommendations();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Helper function to load products
  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGadgetRecommendations();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  // CRUD operations
  const handleAddSuccess = () => {
    setShowAddForm(false);
    setSuccessMessage('Produk berhasil ditambahkan!');
    loadProducts(); // Refresh data
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    setSuccessMessage('Produk berhasil diperbarui!');
    loadProducts(); // Refresh data
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteSuccess = () => {
    setDeletingProduct(null);
    setSuccessMessage('Produk berhasil dihapus!');
    loadProducts(); // Refresh data
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6">
                <div className="h-48 bg-neutral-200 rounded-md mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-red-800">Failed to Load Products</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">
              Kelompok 3: Rekomendasi Produk GadgetHouse
            </h1>
            <p className="text-neutral-600 mt-2">
              Temukan gadget dan elektronik terbaik untuk kebutuhan Anda
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Produk
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">
            Menampilkan {products.length} produk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.product_id}
            className="bg-white shadow-sm rounded-lg border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 bg-neutral-100">
              <img
                src={product.image_url}
                alt={product.product_title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/kelompok-3/placeholder-gadget.jpg';
                }}
              />
              {product.category_guess && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
                  {product.category_guess}
                </span>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2 line-clamp-2">
                {product.product_title}
              </h3>

              <p className="text-2xl font-bold text-primary-600 mb-4">
                {product.price_formatted}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-md font-medium transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingProduct({ id: product.product_id, name: product.product_title })}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md font-medium transition-colors text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600">Tidak ada produk tersedia</p>
        </div>
      )}

      {/* CRUD Modals */}
      {showAddForm && (
        <AddProductForm
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmation
          productId={deletingProduct.id}
          productName={deletingProduct.name}
          onSuccess={handleDeleteSuccess}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}
