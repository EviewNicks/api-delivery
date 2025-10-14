'use client';

interface DeleteConfirmationProps {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmation({
  productName,
  onConfirm,
  onCancel,
  isDeleting
}: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-800 mb-2">
            Konfirmasi Hapus Produk
          </h3>
          <p className="text-neutral-600 mb-4">
            Apakah Anda yakin ingin menghapus produk{' '}
            <span className="font-semibold">{productName}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
