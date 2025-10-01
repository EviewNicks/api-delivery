'use client';

import { useState, useEffect } from 'react';
import { fetchKrusitMakanan, fetchKrusitMinuman } from '@/lib/api-client';
import type { KrusitMenuItemEnriched } from '@/lib/types';

export default function Kelompok4Page() {
  const [makanan, setMakanan] = useState<KrusitMenuItemEnriched[]>([]);
  const [minuman, setMinuman] = useState<KrusitMenuItemEnriched[]>([]);
  const [loadingMakanan, setLoadingMakanan] = useState(true);
  const [loadingMinuman, setLoadingMinuman] = useState(true);
  const [errorMakanan, setErrorMakanan] = useState<string | null>(null);
  const [errorMinuman, setErrorMinuman] = useState<string | null>(null);

  useEffect(() => {
    async function loadMakanan() {
      try {
        setLoadingMakanan(true);
        setErrorMakanan(null);
        const data = await fetchKrusitMakanan();
        setMakanan(data);
      } catch (err) {
        setErrorMakanan(err instanceof Error ? err.message : 'Failed to load makanan');
      } finally {
        setLoadingMakanan(false);
      }
    }

    async function loadMinuman() {
      try {
        setLoadingMinuman(true);
        setErrorMinuman(null);
        const data = await fetchKrusitMinuman();
        setMinuman(data);
      } catch (err) {
        setErrorMinuman(err instanceof Error ? err.message : 'Failed to load minuman');
      } finally {
        setLoadingMinuman(false);
      }
    }

    loadMakanan();
    loadMinuman();
  }, []);

  const MenuCard = ({ item }: { item: KrusitMenuItemEnriched }) => (
    <div className="bg-white shadow-sm rounded-lg border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-neutral-100">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/kelompok-4/placeholder-makanan.png';
          }}
        />
        {!item.is_valid_image && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
            No Image
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        <p className="text-2xl font-bold text-primary-600 mb-4">
          {item.price_formatted}
        </p>

        <button className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );

  const LoadingSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6 animate-pulse">
          <div className="h-48 bg-neutral-200 rounded-md mb-4"></div>
          <div className="h-6 bg-neutral-200 rounded mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );

  const ErrorSection = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-red-800">Failed to Load Data</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={onRetry}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">
          Kelompok 4: Menu Krusit
        </h1>
        <p className="text-neutral-600 mt-2">
          Pesan makanan dan minuman lezat dari Krusit
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Makanan</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {!loadingMakanan && !errorMakanan && `${makanan.length} menu tersedia`}
              </p>
            </div>
          </div>

          {loadingMakanan && <LoadingSection />}

          {errorMakanan && (
            <ErrorSection
              error={errorMakanan}
              onRetry={() => window.location.reload()}
            />
          )}

          {!loadingMakanan && !errorMakanan && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {makanan.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>

              {makanan.length === 0 && (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-600">Tidak ada menu makanan tersedia</p>
                </div>
              )}
            </>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Minuman</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {!loadingMinuman && !errorMinuman && `${minuman.length} menu tersedia`}
              </p>
            </div>
          </div>

          {loadingMinuman && <LoadingSection />}

          {errorMinuman && (
            <ErrorSection
              error={errorMinuman}
              onRetry={() => window.location.reload()}
            />
          )}

          {!loadingMinuman && !errorMinuman && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {minuman.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>

              {minuman.length === 0 && (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-600">Tidak ada menu minuman tersedia</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
