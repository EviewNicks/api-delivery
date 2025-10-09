"use client";

import { useState, useEffect } from "react";
import {
  fetchBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  ApiError,
} from "@/lib/api-client";
import type { TripnesiaBooking, TripnesiaBookingEnriched } from "@/lib/types";
import BookingList from "@/features/tripnesia/components/BookingList";
import BookingForm from "@/features/tripnesia/components/BookingForm";

export default function TripnesiaPage() {
  const [bookings, setBookings] = useState<TripnesiaBookingEnriched[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] =
    useState<TripnesiaBookingEnriched | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal memuat data booking"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCreate = async (data: Omit<TripnesiaBooking, "id">) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createBooking(data);
      await loadBookings();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal membuat booking");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Omit<TripnesiaBooking, "id">) => {
    if (!editingBooking) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await updateBooking(editingBooking.id, data);
      await loadBookings();
      setEditingBooking(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal mengupdate booking"
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await deleteBooking(id);
      await loadBookings();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal menghapus booking"
      );
    }
  };

  const handleEdit = (booking: TripnesiaBookingEnriched) => {
    setEditingBooking(booking);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                Tripnesia Travel Booking
              </h1>
              <p className="mt-2 text-neutral-600">
                Kelola booking penerbangan, hotel, dan paket wisata
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary-500 text-white bg-dark-200 rounded-md font-medium hover:bg-primary-600 active:bg-primary-700 transition-colors"
            >
              + Buat Booking Baru
            </button>
          </div>

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-neutral-800">
              Daftar Booking
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Total: {bookings.length} booking
            </p>
          </div>

          <BookingList
            bookings={bookings}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-6 bg-white shadow-sm rounded-lg border border-neutral-100 p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            API Status
          </h3>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Online
            </span>
            <span className="text-sm text-neutral-600">
              https://tripnesia-vm51.vercel.app/api/bookings
            </span>
          </div>
        </div>
      </div>

      {showForm && (
        <BookingForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {editingBooking && (
        <BookingForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingBooking(null)}
          initialData={editingBooking}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
