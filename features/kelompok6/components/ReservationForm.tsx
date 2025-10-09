'use client';

import { useState, FormEvent } from 'react';
import type { HouseCafeReservation } from '@/lib/types';

interface ReservationFormProps {
  initialData?: Partial<HouseCafeReservation>;
  onSubmit: (data: Omit<HouseCafeReservation, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit';
  loading?: boolean;
}

export function ReservationForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  loading = false
}: ReservationFormProps) {
  const [formData, setFormData] = useState({
    nama: initialData?.nama || '',
    email: initialData?.email || '',
    telepon: initialData?.telepon || '',
    tanggal: initialData?.tanggal || '',
    jam: initialData?.jam || '',
    jumlah_orang: initialData?.jumlah_orang || 1,
    catatan: initialData?.catatan || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor telepon harus diisi';
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }

    if (!formData.jam) {
      newErrors.jam = 'Jam harus diisi';
    }

    if (formData.jumlah_orang < 1) {
      newErrors.jumlah_orang = 'Jumlah orang minimal 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.nama ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="Masukkan nama lengkap"
          disabled={loading}
        />
        {errors.nama && (
          <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.email ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="contoh@email.com"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Nomor Telepon <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.telepon}
          onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.telepon ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="+628123456789"
          disabled={loading}
        />
        {errors.telepon && (
          <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Tanggal <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.tanggal}
            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.tanggal ? 'border-red-500' : 'border-neutral-300'
            }`}
            disabled={loading}
          />
          {errors.tanggal && (
            <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Jam <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={formData.jam}
            onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.jam ? 'border-red-500' : 'border-neutral-300'
            }`}
            disabled={loading}
          />
          {errors.jam && (
            <p className="text-red-500 text-sm mt-1">{errors.jam}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Jumlah Orang <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="1"
          value={formData.jumlah_orang}
          onChange={(e) => setFormData({ ...formData, jumlah_orang: parseInt(e.target.value) || 1 })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.jumlah_orang ? 'border-red-500' : 'border-neutral-300'
          }`}
          disabled={loading}
        />
        {errors.jumlah_orang && (
          <p className="text-red-500 text-sm mt-1">{errors.jumlah_orang}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Catatan Khusus
        </label>
        <textarea
          value={formData.catatan || ''}
          onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          rows={3}
          placeholder="Contoh: Meja dekat jendela, alergi makanan, dll"
          disabled={loading}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md font-medium hover:bg-neutral-50 transition-colors"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : mode === 'create' ? 'Buat Reservasi' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}
