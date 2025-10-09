'use client';

import { useState, useEffect } from 'react';
import type { TripnesiaBooking } from '@/lib/types';

interface BookingFormProps {
  onSubmit: (data: Omit<TripnesiaBooking, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: TripnesiaBooking;
  isSubmitting?: boolean;
}

export default function BookingForm({ onSubmit, onCancel, initialData, isSubmitting }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'flight',
    destination: initialData?.destination || '',
    date: initialData?.date || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama pelanggan harus diisi';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destinasi harus diisi';
    }

    if (!formData.date) {
      newErrors.date = 'Tanggal harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-800">
            {initialData ? 'Edit Booking' : 'Buat Booking Baru'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              Nama Pelanggan
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Masukkan nama pelanggan"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
              Tipe Booking
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="flight">Penerbangan</option>
              <option value="hotel">Hotel</option>
              <option value="tour">Paket Wisata</option>
            </select>
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-neutral-700 mb-1">
              Destinasi
            </label>
            <input
              type="text"
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.destination ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Contoh: Raja Ampat, Bali"
            />
            {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.date ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : (initialData ? 'Update' : 'Buat Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
