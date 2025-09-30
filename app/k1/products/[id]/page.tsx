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

        {/* Product Specifications */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-neutral-800 mb-4 text-lg">Spesifikasi Produk</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-600">Material</span>
              <span className="font-medium text-neutral-800">Premium Cotton Blend</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-600">Kondisi</span>
              <span className="font-medium text-neutral-800">Like New</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-600">Berat</span>
              <span className="font-medium text-neutral-800">0.5 kg</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-600">Perawatan</span>
              <span className="font-medium text-neutral-800">Dry Clean Only</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-600">Tahun Produksi</span>
              <span className="font-medium text-neutral-800">2024</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-600">Brand</span>
              <span className="font-medium text-neutral-800">Local Premium</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-neutral-800 text-lg">Ulasan Pelanggan</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-neutral-800">4.8</span>
              <div className="flex text-yellow-500">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <span className="text-sm text-neutral-500">(24 ulasan)</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Review 1 */}
            <div className="border-b border-neutral-100 pb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-neutral-800">Sarah K.</p>
                  <div className="flex text-yellow-500 text-sm">★★★★★</div>
                </div>
                <span className="text-sm text-neutral-500">2 minggu lalu</span>
              </div>
              <p className="text-neutral-600 text-sm">
                Kualitas baju sangat bagus, sesuai dengan foto. Proses penyewaan mudah dan pelayanan ramah. Sangat recommended!
              </p>
            </div>

            {/* Review 2 */}
            <div className="border-b border-neutral-100 pb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-neutral-800">Andi Prasetyo</p>
                  <div className="flex text-yellow-500 text-sm">★★★★☆</div>
                </div>
                <span className="text-sm text-neutral-500">1 bulan lalu</span>
              </div>
              <p className="text-neutral-600 text-sm">
                Bajunya bagus dan bersih. Ukuran sesuai. Hanya saja proses pengambilan agak lama karena antrian.
              </p>
            </div>

            {/* Review 3 */}
            <div className="pb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-neutral-800">Maya Sari</p>
                  <div className="flex text-yellow-500 text-sm">★★★★★</div>
                </div>
                <span className="text-sm text-neutral-500">2 bulan lalu</span>
              </div>
              <p className="text-neutral-600 text-sm">
                Perfect untuk acara formal! Bahan premium dan fitting nya pas. Pasti akan sewa lagi untuk acara berikutnya.
              </p>
            </div>
          </div>
        </div>

        {/* Rental History Timeline */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-neutral-800 mb-4 text-lg">Riwayat Penyewaan</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-0.5 h-16 bg-neutral-200"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-800">Tersedia Sekarang</p>
                <p className="text-sm text-neutral-500">Produk siap disewa</p>
              </div>
              <span className="text-sm text-neutral-500">Hari ini</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-0.5 h-16 bg-neutral-200"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-800">Disewa oleh Customer</p>
                <p className="text-sm text-neutral-500">Acara: Pernikahan</p>
              </div>
              <span className="text-sm text-neutral-500">2 minggu lalu</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-0.5 h-16 bg-neutral-200"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-800">Maintenance & Cleaning</p>
                <p className="text-sm text-neutral-500">Deep cleaning dan quality check</p>
              </div>
              <span className="text-sm text-neutral-500">1 bulan lalu</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-800">Disewa oleh Customer</p>
                <p className="text-sm text-neutral-500">Acara: Wisuda</p>
              </div>
              <span className="text-sm text-neutral-500">2 bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <h3 className="font-semibold text-neutral-800 mb-4 text-lg">Produk Serupa</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="w-full h-32 bg-neutral-200 rounded mb-3"></div>
                <p className="font-medium text-neutral-800 text-sm mb-1">Produk Serupa {item}</p>
                <p className="text-primary-600 font-semibold text-sm">Rp 150.000</p>
                <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  Tersedia
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rental Terms */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-neutral-800 mb-3 text-lg">Syarat & Ketentuan Penyewaan</h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Minimal penyewaan 1 hari, maksimal 7 hari</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Deposit keamanan Rp 200.000 (dikembalikan setelah pengembalian)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Pembayaran dapat dilakukan via transfer bank atau cash</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Produk harus dikembalikan dalam kondisi bersih dan tidak rusak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>Denda keterlambatan Rp 50.000 per hari</span>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        {product.status === 'AVAILABLE' && (
          <div className="text-center">
            <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition shadow-sm hover:shadow-md">
              Hubungi untuk Menyewa
            </button>
            <p className="text-sm text-neutral-500 mt-3">
              Atau hubungi WhatsApp: <span className="font-medium text-primary-600">+62 812-3456-7890</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}