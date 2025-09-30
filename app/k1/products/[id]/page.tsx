'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProductDetail } from '@/lib/api-client';
import type { Product } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedId(p.id));
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;

    async function loadDetail() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductDetail(resolvedId!);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengambil detail produk');
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [resolvedId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-8 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Kembali
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error || 'Produk tidak ditemukan'}</p>
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Kembali
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb & Back Button */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => router.push('/')}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => router.push('/k1')}
            className="hover:text-blue-600"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
        >
          ← Kembali ke Daftar Produk
        </button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="space-y-4">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                unoptimized
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 text-sm">Kode: {product.code}</p>
            </div>

            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                Rp {product.currentPrice.toLocaleString('id-ID')}
              </div>
              <p className="text-sm text-gray-500">
                Modal Awal: Rp {product.modalAwal.toLocaleString('id-ID')}
              </p>
            </div>

            <div>
              <span
                className={`inline-block px-4 py-2 rounded-lg font-medium ${
                  product.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : product.status === 'RENTED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {product.status === 'AVAILABLE'
                  ? '✓ Tersedia untuk Disewa'
                  : product.status === 'RENTED'
                  ? '✗ Sedang Disewa'
                  : '⚠ Maintenance'}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Kategori</h3>
              <span
                className="inline-block px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: product.category?.color ? product.category.color + '20' : '#e5e7eb',
                  color: product.category?.color || '#6b7280',
                }}
              >
                {product.category?.name || 'N/A'}
              </span>
            </div>

            {product.color && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Warna</h3>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: product.color.hexCode }}
                  ></div>
                  <span className="text-gray-700 font-medium">{product.color.name}</span>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Tidak ada deskripsi tersedia untuk produk ini.'}
              </p>
            </div>
          </div>
        </div>

        {/* Size Variants */}
        {product.sizes.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Ukuran Tersedia</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.sizes.map((size, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition"
                >
                  <div className="text-2xl font-bold text-gray-900 mb-1">{size.size}</div>
                  <div className="text-sm text-gray-600 mb-2">{size.ageCategory}</div>
                  <div className="text-xs text-gray-500">
                    Stock: <span className="font-semibold text-gray-700">{size.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {product.status === 'AVAILABLE' && (
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
              Hubungi untuk Menyewa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}