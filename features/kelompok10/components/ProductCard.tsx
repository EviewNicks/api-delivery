'use client';

import { CafekuProductEnriched } from '@/lib/types';
import Image from 'next/image';

interface ProductCardProps {
  product: CafekuProductEnriched;
  onEdit?: (product: CafekuProductEnriched) => void;
  onDelete?: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const stockBadgeColor = {
    in_stock: 'bg-green-100 text-green-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800'
  }[product.stock_status];

  const stockBadgeText = {
    in_stock: 'Tersedia',
    low_stock: 'Stok Terbatas',
    out_of_stock: 'Habis'
  }[product.stock_status];

  return (
    <div className="bg-white shadow-sm rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full h-48 bg-neutral-100">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-neutral-800 text-lg line-clamp-1">
            {product.title}
          </h3>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockBadgeColor}`}>
            {stockBadgeText}
          </span>
        </div>

        <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-500">
            {product.price_formatted}
          </span>
          <span className="text-sm text-neutral-500">
            Stock: {product.stock}
          </span>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-md font-medium transition-colors text-sm"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-md font-medium transition-colors text-sm"
              >
                Hapus
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
