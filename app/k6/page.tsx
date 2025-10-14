"use client";

import { useState } from "react";
import { useReservations } from "@/features/kelompok6/hooks/useReservations";
import { ReservationTable } from "@/features/kelompok6/components/ReservationTable";
import { ReservationDetail } from "@/features/kelompok6/components/ReservationDetail";
import { CreateReservationModal } from "@/features/kelompok6/components/CreateReservationModal";
import { EditReservationModal } from "@/features/kelompok6/components/EditReservationModal";
import { DeleteConfirmDialog } from "@/features/kelompok6/components/DeleteConfirmDialog";

export default function K6DashboardPage() {
  const { reservations, loading, error, refetch } = useReservations();
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const selectedReservation = reservations.find(
    (r) => r.id === selectedReservationId
  );

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedReservation) {
      setReservationToDelete({
        id: selectedReservation.id,
        name: selectedReservation.nama,
      });
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteSuccess = () => {
    setSelectedReservationId(null);
    refetch();
  };

  const upcomingCount = reservations.filter((r) => r.is_upcoming).length;
  const pastCount = reservations.filter((r) => !r.is_upcoming).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-neutral-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-800">
                  House Cafe - Reservasi
                </h1>
                <p className="text-neutral-600 mt-2">
                  Sistem manajemen reservasi House Cafe
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  API Online
                </span>
                <a
                  href="https://v0-house-cafe-website-project.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Kunjungi Website
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm text-neutral-500 font-medium">
                  Total Reservasi
                </p>
                <p className="text-2xl font-bold text-neutral-800 mt-1">
                  {reservations.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  Reservasi Mendatang
                </p>
                <p className="text-2xl font-bold text-green-800 mt-1">
                  {upcomingCount}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <p className="text-sm text-neutral-500 font-medium">
                  Reservasi Selesai
                </p>
                <p className="text-2xl font-bold text-neutral-800 mt-1">
                  {pastCount}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="w-full md:w-auto bg-blue-500 hover:bg-primary-600 active:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
                Buat Reservasi Baru
              </button>
            </div>
          </div>

          {loading && (
            <div className="bg-white shadow-sm rounded-lg border border-neutral-100 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="text-neutral-600 mt-4">Memuat data reservasi...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="text-red-800 font-medium">
                    Gagal Memuat Data
                  </h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <button
                    onClick={refetch}
                    className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <ReservationTable
              reservations={reservations}
              onViewDetail={(id) => setSelectedReservationId(id)}
            />
          )}
        </div>

        {selectedReservation && (
          <ReservationDetail
            reservation={selectedReservation}
            onClose={() => setSelectedReservationId(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <CreateReservationModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={refetch}
        />

        <EditReservationModal
          isOpen={editModalOpen}
          reservation={selectedReservation}
          onClose={() => setEditModalOpen(false)}
          onSuccess={refetch}
        />

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          reservationId={reservationToDelete?.id || null}
          reservationName={reservationToDelete?.name || ""}
          onClose={() => {
            setDeleteDialogOpen(false);
            setReservationToDelete(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  );
}
