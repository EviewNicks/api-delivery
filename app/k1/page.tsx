'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/api-client';
import type { ProductListResponse, Product } from '@/lib/types';
import { ProductForm } from '@/features/kelompok1/components/ProductForm';
import { ProductActions } from '@/features/kelompok1/components/ProductActions';

export default function Kelompok1Page() {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getProducts(page, 12, search || undefined, 'AVAILABLE');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadProducts()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rental Baju</h1>
          <p className="text-gray-600">Kelompok 1 - Sistem Komputasi</p>
        </div>
        <button
          onClick={() => {
            setEditProduct(undefined);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tambah Produk
        </button>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data?.products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <Link href={`/k1/products/${product.id}`} className="block">
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded mb-4"
                      unoptimized
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description || 'Tidak ada deskripsi'}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold">
                      Rp {product.currentPrice.toLocaleString('id-ID')}
                    </span>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: product.color?.hexCode ? product.color.hexCode + '20' : '#e5e7eb',
                        color: product.color?.hexCode || '#6b7280',
                      }}
                    >
                      {product.category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status === 'AVAILABLE' ? 'Tersedia' : 'Disewa'}
                    </span>
                    {product.sizes.length > 0 && (
                      <span className="text-xs text-gray-500">
                        Size: {product.sizes.map((s) => s.size).join(', ')}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="mt-3 pt-3 border-t">
                  <ProductActions
                    product={product}
                    onEdit={() => {
                      setEditProduct(product);
                      setShowForm(true);
                    }}
                    onDelete={() => {
                      loadProducts();
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProductForm
              product={editProduct}
              onSuccess={() => {
                setShowForm(false);
                setEditProduct(undefined);
                loadProducts();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditProduct(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}