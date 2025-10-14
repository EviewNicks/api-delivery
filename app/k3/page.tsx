'use client';

import { useState, useEffect } from 'react';
import { fetchGadgetRecommendations } from '@/lib/api-client';
import type { GadgetProductEnriched } from '@/lib/types';

export default function Kelompok3Page() {
  const [products, setProducts] = useState<GadgetProductEnriched[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <h1 className="text-3xl font-bold text-neutral-800">
          Kelompok 3: Rekomendasi Produk GadgetHouse
        </h1>
        <p className="text-neutral-600 mt-2">
          Temukan gadget dan elektronik terbaik untuk kebutuhan Anda
        </p>
      </div>

      <div className="mb-4">
        <span className="text-sm text-neutral-600">
          Menampilkan {products.length} produk
        </span>
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

              <button className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600">Tidak ada produk tersedia</p>
        </div>
      )}
    </div>
  );
}
